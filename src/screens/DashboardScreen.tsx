import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { deviceAPI, authAPI, Device, DeviceCurrentStatus, Alert as DeviceAlert } from '../services/api';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useRouter } from 'expo-router';
import { NetworkService } from '../utils/network-utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<Map<string, DeviceCurrentStatus>>(
    new Map()
  );
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [addingDevice, setAddingDevice] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsPage, setAlertsPage] = useState(1);
  const [loadingMoreAlerts, setLoadingMoreAlerts] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const isUnmountingRef = React.useRef(false);

  const loadData = async () => {
    if (isUnmountingRef.current) return; // Don't start new requests if logging out
    
    // Check network first
    const online = await NetworkService.checkConnection();
    setIsOnline(online);
    
    if (!online) {
      // Try to load cached data
      try {
        const cachedDevices = await AsyncStorage.getItem('@cached_devices');
        const cachedUser = await AsyncStorage.getItem('@cached_user');
        const cachedAlerts = await AsyncStorage.getItem('@cached_alerts');
        
        if (cachedDevices) setDevices(JSON.parse(cachedDevices));
        if (cachedUser) setUser(JSON.parse(cachedUser));
        if (cachedAlerts) setAlerts(JSON.parse(cachedAlerts));
        
        setLoading(false);
        setAuthChecked(true);
        setHasError(true);
        setErrorMessage('You are currently offline. Showing cached data.');
      } catch (e) {
        setLoading(false);
        setAuthChecked(true);
        setHasError(true);
        setErrorMessage('You are currently offline and no cached data available.');
      }
      return;
    }
    
    setHasError(false);
    setErrorMessage('');
    
    try {
      const [userData, devicesData] = await Promise.all([
        authAPI.getCurrentUser(),
        deviceAPI.getMyDevices(),
      ]);

      if (isUnmountingRef.current) return; // Don't update state if logged out
      
      setUser(userData);
      setDevices(devicesData);

      // Load status for each device
      const statusPromises = devicesData.map((device) =>
        deviceAPI.getDeviceCurrentStatus(device.id).catch(() => null)
      );
      
      // Load alerts from all devices
      const alertsPromises = devicesData.map((device) =>
        deviceAPI.getDeviceAlerts(device.id).catch(() => [])
      );
      const statuses = await Promise.all(statusPromises);

      const statusMap = new Map();
      statuses.forEach((status, index) => {
        if (status) {
          statusMap.set(devicesData[index].id, status);
        }
      });
      
      if (isUnmountingRef.current) return; // Don't update state if logged out
      setDeviceStatuses(statusMap);
    } catch (error: any) {
      if (isUnmountingRef.current) return; // Ignore errors if logging out
      // Only log non-auth errors
      if (error.response?.status !== 401) {
        console.error('Failed to load data:', error);
      }
      
      // If 401, redirect to login (storage already cleared by interceptor)
      if (error.response?.status === 401 || error.isAuthError) {
        console.log('🔐 Session expired, redirecting to login...');
        router.replace('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // Subscribe to network changes
    const unsubscribe = NetworkService.subscribe((online) => {
      setIsOnline(online);
      if (online && hasError) {
        // Reconnected, try loading again
        loadData();
      }
    });
    
    // Check auth first
    const checkAuthAndLoad = async () => {
      const isAuth = await authAPI.isAuthenticated();
      if (!isAuth) {
        console.log('Not authenticated, redirecting to login');
        router.replace('/');
        return;
      }
      setAuthChecked(true);
      loadData();
    };
    
    checkAuthAndLoad();
    
    // Auto refresh every 10 seconds (only if online)
    intervalRef.current = setInterval(() => {
      if (authChecked && isOnline) {
        loadData();
      }
    }, 10000);
    
    return () => {
      unsubscribe();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [authChecked, isOnline, hasError]);

  const onlineDevices = devices.filter((d) => deviceStatuses.get(d.id)?.online);
  const offlineDevices = devices.filter((d) => !deviceStatuses.get(d.id)?.online);

  const handleAddDevice = async () => {
    if (!newDeviceId.trim() || !newDeviceName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setAddingDevice(true);
    try {
      await deviceAPI.registerDevice(newDeviceId.trim(), newDeviceName.trim());
      setShowAddModal(false);
      setNewDeviceId('');
      setNewDeviceName('');
      await loadData();
      Alert.alert('Success', 'Device added successfully! 🎉');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to add device');
    } finally {
      setAddingDevice(false);
    }
  };

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return;

    setDeleting(true);
    try {
      await deviceAPI.removeDevice(deviceToDelete.id);
      setShowDeleteModal(false);
      setDeviceToDelete(null);
      await loadData();
      Alert.alert('Success', 'Device removed from your account');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to remove device');
    } finally {
      setDeleting(false);
    }
  };

  const loadMoreAlerts = () => {
    setAlertsPage(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLogout = async () => {
    console.log('🚪 Logout clicked - clearing local session');
    
    // Prevent any further async work and stop polling
    isUnmountingRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Ensure we actually remove the keys used by authAPI
    try {
      await AsyncStorage.multiRemove([
        '@iotux_auth_token',
        '@iotux_user_data',
        '@cached_devices',
        '@cached_user',
        '@cached_alerts',
      ]);
    } catch {}
    
    // Redirect to login
    setTimeout(() => {
      router.replace('/login');
    }, 0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>📡 No Internet Connection</Text>
        </View>
      )}
      
      {/* Error State - Full Screen */}
      {hasError && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>You're Currently Offline</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setHasError(false);
              loadData();
            }}
          >
            <Text style={styles.retryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
          
          {devices.length > 0 && (
            <TouchableOpacity 
              style={styles.viewCachedButton}
              onPress={() => setHasError(false)}
            >
              <Text style={styles.viewCachedButtonText}>View Cached Data</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Normal UI - Only show if no error or user chose to view cached */}
      {!hasError && (
        <>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.headerSubtitle}>Monitor your devices</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{devices.length}</Text>
            <Text style={styles.statLabel}>Total Devices</Text>
          </Card>
          
          <Card style={[styles.statCard, styles.statCardGreen]}>
            <Text style={[styles.statNumber, { color: COLORS.online }]}>
              {onlineDevices.length}
            </Text>
            <Text style={styles.statLabel}>Online</Text>
          </Card>
          
          <Card style={[styles.statCard, styles.statCardRed]}>
            <Text style={[styles.statNumber, { color: COLORS.offline }]}>
              {offlineDevices.length}
            </Text>
            <Text style={styles.statLabel}>Offline</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                if (devices.length === 0) {
                  Alert.alert('No Devices', 'You have no devices to delete');
                  return;
                }
                setDeviceToDelete(devices[0]);
                setShowDeleteModal(true);
              }}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
                <Text style={styles.actionText}>Delete Device</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowAddModal(true)}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.secondaryLight]}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionText}>Add Device</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Devices</Text>
          {devices.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No devices registered yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first device to get started
              </Text>
            </Card>
          ) : (
            devices.slice(0, 5).map((device) => {
              const status = deviceStatuses.get(device.id);
              return (
                <TouchableOpacity
                  key={device.id}
                  onPress={() =>
                    router.push(`/device-detail?deviceId=${device.id}`)
                  }
                >
                  <Card style={styles.deviceCard}>
                    <View style={styles.deviceHeader}>
                      <View style={styles.deviceInfo}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        <Text style={styles.deviceId}>{device.id}</Text>
                      </View>
                      <StatusBadge
                        status={status?.online ? 'online' : 'offline'}
                      />
                    </View>
                    {!!status?.last_status && (
                      <Text style={styles.deviceStatus}>
                        Status: {status.last_status}
                      </Text>
                    )}
                    {status?.lat != null && status?.lon != null && (
                      <Text style={styles.deviceLocation}>
                        📍 {status.lat.toFixed(6)}, {status.lon.toFixed(6)}
                      </Text>
                    )}
                  </Card>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {alerts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No alerts yet</Text>
              <Text style={styles.emptySubtext}>
                Activity from your devices will appear here
              </Text>
            </Card>
          ) : (
            <Card style={styles.alertsCard}>
              {alerts.slice(0, alertsPage * 5).map((alert) => (
                <View key={`${alert.deviceId}-${alert.id}`} style={styles.alertItem}>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertLeft}>
                      <Text style={styles.alertDevice}>{alert.deviceName}</Text>
                      <Text style={styles.alertStatus}>{alert.status || 'Unknown'}</Text>
                    </View>
                    <Text style={styles.alertTime}>
                      {alert.created_at ? formatDate(alert.created_at) : 'N/A'}
                    </Text>
                  </View>
                  {alert.lat != null && alert.lon != null && (
                    <Text style={styles.alertLocation}>
                      📍 {alert.lat.toFixed(6)}, {alert.lon.toFixed(6)}
                    </Text>
                  )}
                </View>
              ))}
              
              {alerts.length > alertsPage * 5 && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={loadMoreAlerts}
                >
                  <Text style={styles.loadMoreText}>Load More</Text>
                  <Text style={styles.loadMoreIcon}>↓</Text>
                </TouchableOpacity>
              )}
            </Card>
          )}
        </View>
      </ScrollView>
      </>
      )}

      {/* Add Device Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Device</Text>
            <Text style={styles.modalSubtitle}>
              Enter your device ID and a friendly name
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Device ID</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., MOTOR-ABC123"
                value={newDeviceId}
                onChangeText={setNewDeviceId}
                autoCapitalize="characters"
                editable={!addingDevice}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Device Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., My Honda Beat"
                value={newDeviceName}
                onChangeText={setNewDeviceName}
                editable={!addingDevice}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewDeviceId('');
                  setNewDeviceName('');
                }}
                disabled={addingDevice}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddDevice}
                disabled={addingDevice}
              >
                {addingDevice ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>Add Device</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Device Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Device?</Text>
            <Text style={styles.modalSubtitle}>
              Select a device to remove from your account
            </Text>

            <View style={styles.deviceSelector}>
              {devices.map((device) => (
                <TouchableOpacity
                  key={device.id}
                  style={[
                    styles.deviceSelectorItem,
                    deviceToDelete?.id === device.id && styles.deviceSelectorItemActive,
                  ]}
                  onPress={() => setDeviceToDelete(device)}
                >
                  <Text style={[
                    styles.deviceSelectorText,
                    deviceToDelete?.id === device.id && styles.deviceSelectorTextActive,
                  ]}>
                    {device.name}
                  </Text>
                  <Text style={styles.deviceSelectorId}>{device.id}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeviceToDelete(null);
                }}
                disabled={deleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteDevice}
                disabled={deleting || !deviceToDelete}
              >
                {deleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.xxl + 20,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs / 2,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.9)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  statCardGreen: {
    backgroundColor: `${COLORS.online}10`,
  },
  statCardRed: {
    backgroundColor: `${COLORS.offline}10`,
  },
  statNumber: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  actionGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  deviceCard: {
    marginBottom: SPACING.md,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: SPACING.xs / 2,
  },
  deviceId: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  deviceStatus: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginTop: SPACING.xs,
  },
  deviceLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginTop: SPACING.xs / 2,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray900,
    backgroundColor: COLORS.white,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: COLORS.gray200,
  },
  cancelButtonText: {
    color: COLORS.gray700,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  deviceSelector: {
    maxHeight: 300,
    marginBottom: SPACING.md,
  },
  deviceSelectorItem: {
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  deviceSelectorItemActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  deviceSelectorText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: SPACING.xs / 2,
  },
  deviceSelectorTextActive: {
    color: COLORS.primary,
  },
  deviceSelectorId: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  alertsCard: {
    padding: SPACING.md,
  },
  alertItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  alertLeft: {
    flex: 1,
  },
  alertDevice: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs / 2,
  },
  alertStatus: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.gray900,
  },
  alertTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
  alertLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginTop: SPACING.xs / 2,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  loadMoreText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  loadMoreIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
  },
  offlineBanner: {
    backgroundColor: '#ef4444',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBannerText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  errorIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  errorTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 200,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  viewCachedButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  viewCachedButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

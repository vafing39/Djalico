import { AuthContext } from '@/contexts/authContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import { Camera, CreditCard as Edit3, Mail, Phone, Plus, Save, Settings, Trash2, User, X } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
  deepBlue: "#0E2B45",       // text & deep accents
  navy: "#103149",
  paleBlue: "#F3F8FB",       // background card
  bgGradientTop: "#ECF6FF",  // page gradient top
  bgGradientBottom: "#FFFFFF",
  yellow: "#FFD66B",         // accent pastel yellow
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showAddChild, setShowAddChild] = useState(false);
  const authState = useContext(AuthContext);
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [editingParent, setEditingParent] = useState<string | null>(null);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [editParentData, setEditParentData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [professeur, setProfesseur] = useState([
    { 
      id: 'kamal', 
      name: 'Kamal', 
      age: 6, 
      color: COLORS.yellowDark,
      photo: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
  ]);

  const [student, setStudent] = useState([
    {
      id: 'marie',
      name: 'Marie Dubois',
      role: 'Maman',
      email: 'marie.dubois@email.com',
      phone: '+33 6 12 34 56 78',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
  ]);

  const addChild = () => {
    if (newChildName.trim() && newChildAge.trim()) {
      const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
      const newChild = {
        id: Date.now().toString(),
        name: newChildName.trim(),
        age: parseInt(newChildAge),
        color: colors[professeur.length % colors.length],
        photo: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      };
      setProfesseur([...professeur, newChild]);
      setNewChildName('');
      setNewChildAge('');
      setShowAddChild(false);
    }
  };

  const deleteChild = (childId: string) => {
    setProfesseur(professeur.filter(child => child.id !== childId));
  };

  const startEditingParent = (parent: any) => {
    setEditingParent(parent.id);
    setEditParentData({
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
    });
  };

  const saveParentChanges = () => {
    if (editingParent && editParentData.name.trim() && editParentData.email.trim()) {
      setStudent(student.map(parent => 
        parent.id === editingParent 
          ? { ...parent, ...editParentData }
          : parent
      ));
      setEditingParent(null);
      setEditParentData({ name: '', email: '', phone: '' });
    }
  };

  const cancelParentEdit = () => {
    setEditingParent(null);
    setEditParentData({ name: '', email: '', phone: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t('profile.title')}</Text>
            <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color={COLORS.navy} onPress={authState.logOut}/>
          </TouchableOpacity>
        </View>

        {/* student Section */}
        <View style={styles.section}>
          {student.map((parent) => (
            <View key={parent.id} style={styles.parentCard}>
              <Image source={{ uri: parent.photo }} style={styles.parentPhoto} />
              
              {editingParent === parent.id ? (
                <View style={styles.parentEditForm}>
                  <View style={styles.editInputContainer}>
                    <User size={16} color="#6B7280" />
                    <TextInput
                      style={styles.editInput}
                      value={editParentData.name}
                      onChangeText={(text) => setEditParentData({...editParentData, name: text})}
                      placeholder="Nom complet"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.editInputContainer}>
                    <Mail size={16} color="#6B7280" />
                    <TextInput
                      style={styles.editInput}
                      value={editParentData.email}
                      onChangeText={(text) => setEditParentData({...editParentData, email: text})}
                      placeholder="Email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                    />
                  </View>
                  <View style={styles.editInputContainer}>
                    <Phone size={16} color="#6B7280" />
                    <TextInput
                      style={styles.editInput}
                      value={editParentData.phone}
                      onChangeText={(text) => setEditParentData({...editParentData, phone: text})}
                      placeholder="Téléphone"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={styles.editActions}>
                    <TouchableOpacity 
                      style={styles.editCancelButton}
                      onPress={cancelParentEdit}
                    >
                      <X size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.editSaveButton,
                        (!editParentData.name.trim() || !editParentData.email.trim()) && styles.editSaveButtonDisabled
                      ]}
                      onPress={saveParentChanges}
                      disabled={!editParentData.name.trim() || !editParentData.email.trim()}
                    >
                      <Save size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.parentInfo}>
                  <Text style={styles.parentName}>{parent.name}</Text>
                  <Text style={styles.parentContact}>{parent.email}</Text>
                  <Text style={styles.parentContact}>{parent.phone}</Text>
                </View>
              )}
              
              {editingParent !== parent.id && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => startEditingParent(parent)}
                >
                  <Edit3 size={18} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* professeur Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('profile.professeur')}</Text>
            <TouchableOpacity 
              style={styles.addChildButton}
              onPress={() => setShowAddChild(!showAddChild)}
            >
              <Plus size={18} color={COLORS.navy} />
              <Text style={styles.addChildButtonText}>{t('common.add')}</Text>
            </TouchableOpacity>
          </View>

          {/* Add Child Form */}
          {showAddChild && (
            <View style={styles.addChildForm}>
              <Text style={styles.addFormTitle}>{t('profile.newChild')}</Text>
              <TextInput
                style={styles.formInput}
                value={newChildName}
                onChangeText={setNewChildName}
                placeholder={t('profile.childName')}
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={styles.formInput}
                value={newChildAge}
                onChangeText={setNewChildAge}
                placeholder={t('profile.age')}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddChild(false);
                    setNewChildName('');
                    setNewChildAge('');
                  }}
                >
                  <X size={16} color="#6B7280" />
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    (!newChildName.trim() || !newChildAge.trim()) && styles.saveButtonDisabled
                  ]}
                  onPress={addChild}
                  disabled={!newChildName.trim() || !newChildAge.trim()}
                >
                  <Save size={16} color="white" />
                  <Text style={styles.saveButtonText}>{t('common.add')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* professeur List */}
          {professeur.map((child) => (
            <View key={child.id} style={styles.childCard}>
              <View style={styles.childMainInfo}>
                <View style={styles.childPhotoContainer}>
                  <Image source={{ uri: child.photo }} style={styles.childPhoto} />
                  <TouchableOpacity style={styles.photoEditButton}>
                    <Camera size={12} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childAge}>Experiences : {child.age} {t('common.years')}</Text>
                  <Text style={styles.parentContact}>+33 6 51 56 93 46</Text>
                </View>
              </View>
              <View style={styles.childActions}>
                <TouchableOpacity style={styles.childActionButton}>
                  <Edit3 size={16} color="#6B7280" />
                </TouchableOpacity>
                {professeur.length > 1 && (
                  <TouchableOpacity 
                    style={styles.childActionButton}
                    onPress={() => deleteChild(child.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.settingItem}
              /* onPress={() => router.push('/settings/language')} */
            >
              <Text style={styles.settingText}>{t('profile.language')}</Text>
              <Text style={styles.settingValue}>{t('profile.french')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingItem}
              /* onPress={() => router.push('/settings/theme')} */
            >
              <Text style={styles.settingText}>{t('profile.theme')}</Text>
              <Text style={styles.settingValue}>{t('profile.light')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.settingItem, styles.lastSettingItem]}
              /* onPress={() => router.push('/settings/privacy')} */
            >
              <Text style={styles.settingText}>{t('profile.privacy')}</Text>
              <Text style={styles.settingValue}>{t('profile.manage')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGradientTop,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.navy,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.deepBlue,
    marginTop: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.yellowDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.yellowDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addChildButtonText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '600',
  },
  parentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  parentPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  parentInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  parentRole: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.yellowDark,
    marginBottom: 8,
  },
  parentContact: {
    fontSize: 14,
    color: COLORS.navy,
    marginBottom: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  parentEditForm: {
    flex: 1,
    marginRight: 12,
  },
  editInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#FAFBFC',
    gap: 10,
  },
  editInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  editCancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editSaveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.yellowDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editSaveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  addChildForm: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addFormTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    backgroundColor: '#FAFBFC',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.yellowDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  childMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childPhotoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  childPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  photoEditButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.yellowDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  childColorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  colorText: {
    fontSize: 12,
    color: '#6B7280',
  },
  childActions: {
    flexDirection: 'row',
    gap: 8,
  },
  childActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 16,
    color: COLORS.navy,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.yellowDark,
    fontWeight: '600',
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  bottomSpace: {
    height: 40,
  },
});
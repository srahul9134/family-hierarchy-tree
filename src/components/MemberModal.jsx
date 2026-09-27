import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Camera, 
  User, 
  Heart, 
  Calendar, 
  MapPin, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Trash2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { resizeAndConvertImage, avatarPresets, generateDefaultAvatar } from '../utils/imageHelpers';

export const MemberModal = ({
  isOpen,
  mode = 'edit', // 'add-child', 'add-parent', 'add-spouse', 'edit'
  targetNode = null,
  onClose,
  onSubmit,
}) => {
  const fileInputRef = useRef(null);
  const spouseFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    relationship: '',
    gender: 'male',
    birthDate: '',
    deathDate: '',
    isDeceased: false,
    location: '',
    occupation: '',
    bio: '',
    avatar: '',
    spouse: {
      name: '',
      title: 'Spouse',
      gender: 'female',
      birthDate: '',
      deathDate: '',
      isDeceased: false,
      bio: '',
      avatar: '',
    }
  });

  const [showSpouseFields, setShowSpouseFields] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isProcessingImg, setIsProcessingImg] = useState(false);

  // Initialize form data when targetNode or mode changes
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && targetNode) {
      setFormData({
        name: targetNode.name || '',
        title: targetNode.title || '',
        relationship: targetNode.relationship || '',
        gender: targetNode.gender || 'male',
        birthDate: targetNode.birthDate || '',
        deathDate: targetNode.deathDate || '',
        isDeceased: Boolean(targetNode.isDeceased),
        location: targetNode.location || '',
        occupation: targetNode.occupation || '',
        bio: targetNode.bio || '',
        avatar: targetNode.avatar || '',
        spouse: targetNode.spouse ? { ...targetNode.spouse } : {
          name: '',
          title: 'Spouse',
          gender: targetNode.gender === 'male' ? 'female' : 'male',
          birthDate: '',
          deathDate: '',
          isDeceased: false,
          bio: '',
          avatar: '',
        }
      });
      setShowSpouseFields(Boolean(targetNode.spouse && targetNode.spouse.name));
    } else if (mode === 'add-child') {
      setFormData({
        name: '',
        title: 'Child / Next Gen',
        relationship: 'Son / Daughter',
        gender: 'male',
        birthDate: '',
        deathDate: '',
        isDeceased: false,
        location: targetNode?.location || '',
        occupation: '',
        bio: '',
        avatar: '',
        spouse: {
          name: '',
          title: 'Spouse',
          gender: 'female',
          birthDate: '',
          avatar: '',
        }
      });
      setShowSpouseFields(false);
    } else if (mode === 'add-parent') {
      setFormData({
        name: '',
        title: 'Senior Patriarch / Matriarch',
        relationship: 'Parent / Ancestor',
        gender: 'male',
        birthDate: '',
        deathDate: '',
        isDeceased: false,
        location: targetNode?.location || '',
        occupation: '',
        bio: '',
        avatar: '',
        spouse: {
          name: '',
          title: 'Spouse',
          gender: 'female',
          birthDate: '',
          avatar: '',
        }
      });
      setShowSpouseFields(true);
    } else if (mode === 'add-spouse') {
      setFormData({
        ...(targetNode || {}),
        spouse: targetNode?.spouse || {
          name: '',
          title: 'Spouse / Partner',
          gender: targetNode?.gender === 'male' ? 'female' : 'male',
          birthDate: '',
          avatar: '',
          bio: '',
        }
      });
      setShowSpouseFields(true);
    }
  }, [isOpen, mode, targetNode]);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = async (e, isSpouse = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImg(true);
      const base64Url = await resizeAndConvertImage(file, 400, 400);
      if (isSpouse) {
        setFormData(prev => ({
          ...prev,
          spouse: { ...prev.spouse, avatar: base64Url }
        }));
      } else {
        setFormData(prev => ({ ...prev, avatar: base64Url }));
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image. Please choose a valid JPG/PNG file.');
    } finally {
      setIsProcessingImg(false);
    }
  };

  const handleSelectPreset = (presetUrl) => {
    setFormData(prev => ({ ...prev, avatar: presetUrl }));
    setShowPresets(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a name for the family member.');
      return;
    }

    const payload = {
      ...formData,
      spouse: showSpouseFields && formData.spouse?.name?.trim() ? formData.spouse : null,
    };

    onSubmit(payload);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    onClose();
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add-child':
        return `Add Child to ${targetNode?.name || 'Family'}`;
      case 'add-parent':
        return 'Add Ancestor / Senior Parent';
      case 'add-spouse':
        return `Add / Edit Spouse for ${targetNode?.name || 'Member'}`;
      default:
        return `Edit Profile: ${targetNode?.name || 'Member'}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto modal-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{getModalTitle()}</h2>
              <p className="text-xs text-slate-400">Configure hierarchy attributes, photos, and life milestones</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Top Avatar Upload Area */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div className="relative group">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name || 'Avatar'}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg ring-2 ring-white/10">
                  {formData.name ? generateDefaultAvatar(formData.name, formData.gender).initials : <User className="w-10 h-10 text-white/70" />}
                </div>
              )}

              {/* Photo Upload trigger badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border border-indigo-400/40 transition-transform active:scale-95"
                title="Upload photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, false)}
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-medium text-slate-200">Profile Photo</h4>
              <p className="text-xs text-slate-400">Upload portrait photo from your computer or pick from presets.</p>
              
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImg}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isProcessingImg ? 'Processing...' : 'Upload Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-xs text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Avatar Presets</span>
                </button>

                {formData.avatar && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                    className="px-2.5 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preset Gallery Accordion */}
          {showPresets && (
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-medium text-slate-400">Choose an Avatar Preset:</span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                {avatarPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="group relative rounded-xl overflow-hidden ring-1 ring-slate-700 hover:ring-2 hover:ring-indigo-400 transition-all aspect-square"
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Johnathan Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Title / Role */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Title / Hierarchy Role
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Eldest Son, Patriarch, Dr."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Non-Binary</option>
              </select>
            </div>

            {/* Relationship tag */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Relationship
              </label>
              <input
                type="text"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                placeholder="e.g. Father, Mother, Son, Granddaughter"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date of Birth / Year
              </label>
              <input
                type="text"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                placeholder="YYYY-MM-DD or 1980"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Deceased Checkbox + Death Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Date of Passing (Optional)
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDeceased}
                    onChange={(e) => setFormData({ ...formData, isDeceased: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Deceased</span>
                </label>
              </div>
              <input
                type="text"
                disabled={!formData.isDeceased}
                value={formData.deathDate}
                onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                placeholder={formData.isDeceased ? 'YYYY-MM-DD or 2020' : 'Check Deceased to enable'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-slate-600"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Residence / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New York, USA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Occupation / Profession
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Software Architect"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Bio / Life Summary */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Biography & Memories
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Notable milestones, accomplishments, hobbies, stories..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Spouse Section Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-semibold text-slate-200">Spouse / Partner Details</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSpouseFields(!showSpouseFields)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              >
                {showSpouseFields ? 'Remove Spouse' : '+ Add Spouse'}
              </button>
            </div>

            {showSpouseFields && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Spouse Name
                    </label>
                    <input
                      type="text"
                      value={formData.spouse?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        spouse: { ...formData.spouse, name: e.target.value }
                      })}
                      placeholder="e.g. Sarah Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Spouse Gender
                    </label>
                    <select
                      value={formData.spouse?.gender || 'female'}
                      onChange={(e) => setFormData({
                        ...formData,
                        spouse: { ...formData.spouse, gender: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Spouse photo upload */}
                <div className="flex items-center gap-4">
                  {formData.spouse?.avatar ? (
                    <img
                      src={formData.spouse.avatar}
                      alt="Spouse"
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-rose-400"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {formData.spouse?.name ? generateDefaultAvatar(formData.spouse.name, formData.spouse.gender).initials : 'SP'}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => spouseFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-rose-400" />
                    <span>Upload Spouse Photo</span>
                  </button>
                  <input
                    ref={spouseFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, true)}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Member</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

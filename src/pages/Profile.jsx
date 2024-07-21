import React, { useState, useRef } from 'react';
import { useMeQuery, useUpdateMutation } from '../redux/api/userApi';
import { FaUser, FaPhone, FaCamera } from 'react-icons/fa';
import { AiOutlineMail } from "react-icons/ai";
import toast from 'react-hot-toast';
import NotFound from '../components/NotFound';

const Profile = () => {
    const { data: me, isLoading } = useMeQuery();
    if( !me){
        return <NotFound/>
    }

    const [update, { isLoading: updateLoading }] = useUpdateMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [newAvatar, setNewAvatar] = useState(null);
    const fileInputRef = useRef(null);
    if (isLoading) return <div className="loading">Loading...</div>;

    const profile = me?.user;

    const initialLetter = profile.name.charAt(0).toUpperCase();

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile({
            name: profile.name,
            phoneNo: profile.phoneNo,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);
            setEditedProfile(prev => ({ ...prev, avatar: file }));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in editedProfile) {
                formData.append(key, editedProfile[key]);
            }
            const res = await update(formData).unwrap();
            if (res.success) {
                toast.success(res.message);
                setIsEditing(false);
                setNewAvatar(null);
            } else {
                toast.error(res.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error(`Failed to update profile: ${error.message}`);
        }
    };
    

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1>Hello {profile.name}</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus facere aperiam id sequi quibusdam .</p>
            </header>

            <main className="profile-content">
                <section className="account-info">
                    <h2>My account</h2>
                    <button className="settings-btn" onClick={isEditing ? handleUpdate : handleEdit}>
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>

                    <div className="user-info">
                        <div className="info-item">
                            <label><FaUser /> Username</label>
                            {isEditing ? (
                                <input
                                    name="name"
                                    value={editedProfile.name || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{profile.name}</p>
                            )}
                        </div>
                        <div className="info-item">
                            <label><AiOutlineMail />Email address</label>
                            <p>{profile.email}</p>
                        </div>
                        <div className="info-item">
                            <label><FaPhone /> Phone</label>
                            {isEditing ? (
                                <input
                                    name="phoneNumber"
                                    value={editedProfile.phoneNo || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{profile.phoneNo}</p>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="profile-sidebar">
                    <div className="avatar">
                        {isEditing ? (
                            <div onClick={handleAvatarClick}>
                                {newAvatar ? (
                                    <img src={URL.createObjectURL(newAvatar)} alt="New Avatar" />
                                ) : profile.avatar && profile.avatar.url ? (
                                    <img src={profile.avatar.url} alt="Avatar" />
                                ) : (
                                    <div className="initial">{initialLetter}</div>
                                )}
                                <div className="avatar-overlay">
                                    <FaCamera />
                                </div>
                            </div>
                        ) : (
                            profile.avatar && profile.avatar.url ? (
                                <img src={profile.avatar.url} alt="Avatar" />
                            ) : (
                                <div className="initial">{initialLetter}</div>
                            )
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>
                    <div className="profile-actions">
                        <p className="connect-btn">{profile.verified && <span className="verified">Verified User</span>}</p>
                        <p className="message-btn">{profile.role}</p>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Profile;
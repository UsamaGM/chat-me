import React from "react";
import styled from "styled-components";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleUpdateProfile = async (data: {
    name: string;
    email: string;
    bio?: string;
    avatar?: File;
  }) => {
    try {
      await updateProfile(data);
      navigate("/");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProfilePageContainer>
      <UserProfile user={user} onUpdateProfile={handleUpdateProfile} />
    </ProfilePageContainer>
  );
};

export default ProfilePage;

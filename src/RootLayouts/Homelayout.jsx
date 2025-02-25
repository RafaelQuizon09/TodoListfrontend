import { useState, useEffect } from "react";
import { getToken, getUserId, getUsername } from "../config/config";
export default function Homelayout(){
    if (!getToken()) {
        return <Navigate to="/login" />;
      }
      return (
        <div>
          <h1>Home</h1>
          <p>User ID: {getUserId()}</p>
          <p>Username: {getUsername()}</p>
        </div>
      );
};
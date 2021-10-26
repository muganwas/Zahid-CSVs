import React, { useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export default function Auth() {
  useEffect(() => {
    const jwtKey = process.env.REACT_APP_JWT_KEY;
    axios.post('http://localhost:5000/api/v1/auth', { email: 'badpunter256@gmail.com', password: 'dev123' }).then(async response => {
      if (response) {
        const { data: { token } } = response;
        const info = jwt.verify(token, jwtKey, { complete: true });
        console.log(info);
      }
    }).catch(e => {
      console.log('error', e.message);
    });
    //jwt.decode()
  }, []);
  return (
    <div>
      Auth
    </div>
  );
}

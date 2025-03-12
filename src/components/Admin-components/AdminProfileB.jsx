import React from 'react';
import { Link } from 'react-router-dom'; // Importante

const AdminProfileB = () => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: 'auto',
        }}>
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '282px',
                height: '70px',
                flexShrink: '0',
                borderRadius: '20px',
                background: '#3A4C2E',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 20,
            }}>
                <div style={{ color: 'white' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>ADMIN #52</span>
                    <br />
                    <a href="#" style={{ textDecoration: 'underline', color: 'white', fontSize: '14px' }} onClick={(e) => e.preventDefault()}>
                    VER PERFIL COMPLETO 
                    </a>
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#d9d9d9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C9.327 14 4 15.344 4 18V20H20V18C20 15.344 14.673 14 12 14Z" fill="#000000" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileB;
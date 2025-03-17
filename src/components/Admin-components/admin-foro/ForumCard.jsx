import React from 'react';

const ForumCard = ({ userImage, userName, userNumber, postDate, title, content }) => {
  return (
    <div className="bg-[#435934] p-4 rounded-lg" style={{ width: '407px', height: '125px', flexShrink: 0, borderRadius: '20px' }}>
      <div className="flex items-center mb-2">
        <img src={userImage} alt={userName} className="rounded-full mr-2 w-10 h-10" />
        <div
          style={{
            width: '101px',
            height: '17px',
            flexShrink: 0,
            borderRadius: '20px',
            background: 'rgba(217, 217, 217, 0.50)',
            paddingLeft: '4px',
            paddingRight: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Add this line for horizontal centering
          }}
        >
          <h3 className="font-bold text-xs text-white">{userName} #{userNumber}</h3>
        </div>
        <p className="text-sm ml-2">{postDate}</p>
      </div>
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <p className="text-sm">{content}</p>
    </div>
  );
};

export default ForumCard;
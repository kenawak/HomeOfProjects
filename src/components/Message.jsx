import React from 'react';

const Message = ({ type, message }) => {
  const baseClasses = 'p-4 rounded-lg mt-4';
  const typeClasses = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

export default Message;
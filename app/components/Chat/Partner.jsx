const Partner = ({ partner, onClick }) => {
    return (
      <div onClick={onClick} className="cursor-pointer p-2 hover:bg-gray-100">
        <div className="flex items-center">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={partner?.avatarUrl} alt={partner?.name} />
            </div>
          </div>
          <div className="ml-2">
            <h3 className="font-bold">{partner?.name}</h3>
            <p className="text-sm text-gray-600">{partner?.lastMessage}</p>
          </div>
          {partner.unreadCount > 0 && (
            <div className="ml-auto bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
              {partner.unreadCount}
            </div>
          )}
        </div>
      </div>
    );
  };
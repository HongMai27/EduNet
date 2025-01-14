import { useNavigate } from "react-router-dom";
import { IUser } from "../../types/IUser";
import { useEffect, useRef } from "react";

interface SearchResultsModalProps {
  results: IUser[];
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({
  results,
  onClose,
  searchInputRef,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !(searchInputRef.current && searchInputRef.current.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, searchInputRef]);

  // Redirect to profile
  const handleRedirectToProfile = (userId: string) => {
    onClose();
    navigate(`/profiles/${userId}`);
  };

  return (
    <div
      ref={modalRef}
      className="absolute left-0 right-0 mt-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg shadow-md z-50"
    >
      <div className="p-4 max-h-1/2 overflow-y-auto">
        {results.length > 0 ? (
          results.map((user) => (
            <div
              key={user._id}
              className="py-2 border-b flex items-center cursor-pointer"
              onClick={() => handleRedirectToProfile(user._id)}
            >
              {/* Avatar */}
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-2"
              />
              {/* Username */}
              <p className="text-lg font-semibold">{user.username}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsModal;

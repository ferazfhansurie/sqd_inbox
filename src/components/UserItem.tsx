
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@botpress/client';
import defaultAvatarImg from '../assets/default-avatar.png';

interface UserItemProps {
  user: User;
}

export function UserItem({ user }: UserItemProps) {
  const isBot = user.id === import.meta.env.VITE_BOTPRESS_BOT_ID_AS_USER;

  return (
<div className={`flex gap-2 rounded-xl p-4 w-full ${isBot ? 'border-blue-500' : 'border-black-300'}`}>
  <img
    src={defaultAvatarImg}
    alt="Default avatar"
    className="h-10 rounded-full"
  />
  <div className="flex flex-col">
    <span className="black-text">
      {isBot ? 'Bot' : user.tags['whatsapp:name'] || 'User with no name'}
    </span>
    {!isBot && (
      <span className="black-text">
        {user.tags['whatsapp:userId'] || 'No WhatsApp user id'}
      </span>
    )}
  </div>
  <hr className="my-2" />
  {Object.keys(user.tags).length > 0 && (
    <>
      <div className="flex flex-col gap-2">
        {Object.keys(user.tags)
          .filter(
            (tag) =>
              tag !== 'whatsapp:name' && tag !== 'whatsapp:userId'
          )
          .map((tag) => (
            <span
              className="flex items-center gap-1 bg-gray-200 rounded-xl px-2 py-1 text-xs"
              key={tag}
            >
              <span className="font-medium">🏷️ {tag}</span>{' '}
              <span className="">{user.tags[tag]}</span>
            </span>
          ))}
      </div>
      <hr className="my-2" />
    </>
  )}
  <p className="flex items-center gap-1">
    <span className="black-text">
      Created at{' '}
      {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm', {
        locale: ptBR,
      })}
    </span>
  </p>
</div>
  );
}
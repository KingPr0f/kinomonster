import styles from './ActorCard.module.scss';

interface ActorCardProps {
  name: string;
  character: string;
  photoUrl: string | null;
}

export const ActorCard = ({ name, character, photoUrl }: ActorCardProps) => {
  const imageBase = 'https://image.tmdb.org/t/p/w200'; // Для актеров хватит маленькой картинки
  
  // Если фотки нет — ставим заглушку
  const src = photoUrl 
    ? `${imageBase}${photoUrl}` 
    : 'https://placehold.co/200x300/333/fff?text=No+Photo';

  return (
    <div className={styles.card}>
      <img src={src} alt={name} className={styles.photo} />
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.character}>{character}</div>
      </div>
    </div>
  );
};
import Image from 'next/image';

export function PhotoGrid({ photos = [], variant = 'masonry' }) {
  if (!photos.length) return <p className="notice">In progress</p>;
  return (
    <div className={`photo-grid framed-photo-grid ${variant === 'strip' ? 'photo-strip' : ''}`}>
      {photos.map((photo) => {
        const isLandscape = photo.width && photo.height ? photo.width > photo.height * 1.15 : false;
        const isPortrait = photo.width && photo.height ? photo.height > photo.width * 1.15 : false;
        const shape = isLandscape ? 'landscape-frame' : isPortrait ? 'portrait-frame' : 'square-frame';
        return (
          <article className={`photo-card framed-photo-card ${shape}`} key={photo.id}>
            <div className="frame-mat">
              <div className="frame-photo-window">
                <Image
                  src={photo.thumbUrl || photo.imageUrl}
                  alt={photo.alt || photo.title || 'Portfolio photograph'}
                  width={1100}
                  height={1200}
                />
              </div>
            </div>
            {(photo.title || photo.description) ? (
              <div className="photo-caption frame-caption">
                {photo.title ? <h3>{photo.title}</h3> : null}
                {photo.description ? <p>{photo.description}</p> : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

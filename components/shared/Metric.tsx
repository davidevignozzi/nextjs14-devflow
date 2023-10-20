import Image from 'next/image';
import Link from 'next/link';

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyle?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyle,
  isAuthor
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href && 'rounded-full'}`} // h-auto w-auto
      />

      <p className={`flex items-center gap-1 ${textStyle}`}>
        <span>{value}</span>

        <span
          className={`small-regular line-clamp-1 ${
            isAuthor && 'max-sm:hidden'
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  /**
   * Author is clickable
   */
  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }

  return (
    <div className="flex-center flex-wrap gap-1">{metricContent}</div>
  );
};

export default Metric;

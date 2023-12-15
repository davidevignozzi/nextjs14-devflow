import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Metric from '@/components/shared/Metric';
import JobBadge from '@/components/jobs/JobBadge';

interface JobProps {
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  requiredSkills: string[];
  applyLink: string;
  employerLogo: string;
  employerWebsite: string;
  employerName: string;
  employmentType: string;
  isRemote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  postedAt: string;
}

const JobCard = ({
  title,
  description,
  city,
  state,
  country,
  requiredSkills,
  applyLink,
  employerLogo,
  employerWebsite,
  employerName,
  employmentType,
  isRemote,
  salary,
  postedAt
}: JobProps) => {
  const imageUrl = '/assets/images/site-logo.svg'; // TODO Check if image exists

  const location = `${city ? `${city}${state ? ', ' : ''}` : ''}${
    state || ''
  }${city && state && country ? ', ' : ''}${country || ''}`;

  return (
    <div className="card-wrapper w-full rounded-[10px]">
      <div className="flex flex-row gap-4 p-6">
        <div className="hidden sm:block">
          <JobBadge data={{ website: employerWebsite, logo: imageUrl }} />
        </div>

        <div className="w-full">
          <div className="block sm:hidden">
            <div className="flex flex-col-reverse items-end">
              <JobBadge data={{ location, country }} isLocation />
            </div>
          </div>
          <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
            <div className="flex-1">
              <JobBadge
                data={{ website: employerWebsite, logo: imageUrl }}
                badgeStyles="mb-6 sm:hidden"
              />
              <div className="flex flex-col">
                <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-2">
                  {title || 'example'}
                </h3>
                <h4 className="paragraph-medium text-dark400_light700">
                  {employerName || 'example'}
                </h4>
              </div>
            </div>
            <JobBadge
              data={{ location, country }}
              badgeStyles="hidden sm:flex"
              isLocation
            />
          </div>

          <p className="body-regular text-dark200_light900 mt-3.5 line-clamp-3">
            {/* {description.slice(0, 2000)} */}
            {description ||
              'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'}
          </p>

          {requiredSkills && requiredSkills.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-2">
              {requiredSkills.map((tag) => (
                <Badge
                  key={tag}
                  className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex-between mt-6 w-full flex-wrap gap-3">
            <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
              <Metric
                imgUrl="/assets/icons/clock.svg"
                alt="clock"
                // value={employmentTypeConverter(employmentType)}
                value={employmentType}
                title={''}
                textStyle="small-medium text-light-500"
              />

              <Metric
                imgUrl="/assets/icons/currency-dollar-circle.svg"
                alt="dollar circle"
                // value={getFormattedSalary(salary) || 'TBD'}
                value={''}
                title=""
                textStyle="small-medium text-light-500"
              />
            </div>

            <Link
              href={applyLink || '/'}
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="body-semibold primary-text-gradient">
                View job
              </p>
              <Image
                alt="arrow up right"
                width={20}
                height={20}
                src="/assets/icons/arrow-up-right.svg"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

'use client';

import { HomePageFilters } from '@/constants/filters';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { formUrlQuery } from '@/lib/utils';

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState('');

  /**
   * Handles the click event for filter buttons.
   * Toggles the active state of the clicked filter,
   * updates the URL accordingly, and triggers a router navigation.
   *
   * @param {string} filter - The value of the clicked filter.
   */
  const handleTypeClick = (filter: string) => {
    if (active === filter) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(filter);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: filter.toLowerCase()
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => {
        return (
          <Button
            key={filter.value}
            onClick={() => handleTypeClick(filter.value)}
            className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
              active === filter.value
                ? 'bg-primary-100 text-primary-500 dark:bg-dark-400'
                : 'bg-light-800 text-light-500  hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-400'
            }`}
          >
            {filter.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;

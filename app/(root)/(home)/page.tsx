import QuestionCard from '@/components/cards/QuestionCard';
import HomeFilters from '@/components/home/HomeFilters';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import Link from 'next/link';

const questions = [
  {
    _id: '1',
    title:
      'GitHub repository tips and tricks for beginners and senior developers',
    tags: [
      { _id: '1', name: 'github' },
      { _id: '2', name: 'git' }
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      picture: '/assets/icons/avatar.svg'
    },
    upvotes: 10,
    answers: [],
    views: 100,
    createdAt: new Date('2021-09-01T12:00:00.000Z')
  },
  {
    _id: '2',
    title: 'How to center a div?',
    tags: [
      { _id: '1', name: 'html' },
      { _id: '2', name: 'css' },
      { _id: '3', name: 'flexbox' }
    ],
    author: {
      _id: '2',
      name: 'Jane Smith',
      picture: '/assets/icons/avatar.svg'
    },
    upvotes: 5,
    answers: [],
    views: 50,
    createdAt: new Date('2021-09-02T14:30:00.000Z')
  }
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link
          href="/ask-question"
          className="flex justify-end max-sm:w-full"
        >
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      {/* Questions */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => {
            return (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                answers={question.answers}
                views={question.views}
                createdAt={question.createdAt}
              />
            );
          })
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart
                          the discussion. our query could be the next big thing others learn
                          from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask Question"
          />
        )}
      </div>
    </>
  );
}

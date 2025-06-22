import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ShieldExclamationIcon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You do not have permission to view this page.
          </p>
          <div className="mt-6">
            <a
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

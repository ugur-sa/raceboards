import {
  Dispatch,
  Fragment,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Time, Track } from 'types';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Modal({
  open,
  setOpen,
  cancelButtonRef,
  timeToDelete,
  setShowToast,
  mutate,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cancelButtonRef: MutableRefObject<null>;
  timeToDelete: Time | null;
  setShowToast: Dispatch<SetStateAction<boolean>>;
  mutate: any;
}) {
  const { data: track, error: trackError } = useSWR<Track>(
    timeToDelete
      ? `/api/track/getTrackById?id=${timeToDelete?.track_id}`
      : null,
    fetcher
  );

  if (trackError) return null;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-slate-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-700"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-white"
                      >
                        Delete Time
                      </Dialog.Title>
                      <p>
                        {track?.name ?? ''} ({timeToDelete?.time ?? ''})
                      </p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-200">
                          Are you sure you want to delete this time? This action
                          is not reversible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      deleteTimeFromDB(timeToDelete, mutate, setShowToast);
                      setOpen(false);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-gray-200 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function deleteTimeFromDB(time: Time | null, mutate: any, setShowToast: any) {
  if (time === null) {
    return;
  }
  //delete the time from the database
  fetch('/api/times/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: time.id,
      track_id: time.track_id,
      user_id: time.user_id,
    }),
  }).then((res) => {
    if (res.status === 200) {
      mutate();
      setShowToast({
        success: true,
        error: false,
        message: 'Time deleted successfully',
      });
      //wait 3 seconds and then hide the toast
      setTimeout(() => {
        setShowToast({
          success: false,
          error: false,
          message: '',
        });
      }, 3000);
    } else {
      setShowToast({
        success: false,
        error: true,
        message: 'Error deleting time',
      });
      //wait 3 seconds and then hide the toast
      setTimeout(() => {
        setShowToast({
          success: false,
          error: false,
          message: '',
        });
      }, 3000);
    }
  });
}
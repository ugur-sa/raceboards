import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Dropdown: React.FC<{
  title: string;
  setSelection: any;
  dropdownSections: string[];
}> = ({ title, setSelection, dropdownSections }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-14 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-[8px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 lg:w-32 lg:text-sm">
          {title}
          <ChevronDownIcon
            className="-mr-1 ml-2 hidden lg:block lg:h-5 lg:w-5"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="right-100 absolute z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none lg:w-56">
          <div className="py-1">
            {dropdownSections.map((section, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <a
                    onClick={() => {
                      setSelection(`${title}${index}`);
                    }}
                    className={classNames(
                      active ? 'bg-gray-100 text-blue-500' : 'text-gray-700',
                      'block px-4 py-2 text-[8px] lg:text-sm'
                    )}
                  >
                    {section}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;

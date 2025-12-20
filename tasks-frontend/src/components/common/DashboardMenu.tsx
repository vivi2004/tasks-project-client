import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface MenuItemProps {
  name: string;
  href: string;
}

const menuItems: MenuItemProps[] = [
  { name: 'Projects', href: '/projects' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Team', href: '/team' },
  { name: 'Settings', href: '/settings' },
];

export default function DashboardMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {menuItems.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }: { active: boolean }) => (
                  <a
                    href={item.href}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block px-4 py-2 text-sm`}
                  >
                    {item.name}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

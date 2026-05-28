import React from 'react';
import { Home, Search, ShoppingBag, TestTube2, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const navItems = [
  { label: 'Home', icon: Home, href: '/', match: '/' },
  { label: 'Search', icon: Search, action: 'search' },
  { label: 'Tests', icon: TestTube2, href: '#popular-tests' },
  { label: 'Cart', icon: ShoppingBag, action: 'cart' },
  { label: 'Portal', icon: User, href: '/dashboard', match: '/dashboard' },
];

const MobileBottomNav = ({ onOpenSearch }) => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.cartItems);
  const openCart = useCartStore((state) => state.openCart);

  const isActive = (item) => {
    if (item.action === 'search') return false;
    if (item.match === '/') return location.pathname === '/';
    if (item.match) return location.pathname.startsWith(item.match);
    return false;
  };

  const handleAction = (item) => {
    if (item.action === 'cart') openCart();
    if (item.action === 'search') onOpenSearch?.();
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[450] border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_30px_rgba(15,23,42,0.06)] md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          const inner = (
            <>
              <span className={`relative grid h-9 w-9 place-items-center rounded-full transition active:scale-95 ${active ? 'bg-teal-50 text-teal-600' : 'text-slate-400'}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {item.action === 'cart' && cartItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-semibold ${active ? 'text-teal-600' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {active && <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-teal-600" />}
            </>
          );

          const className = 'relative flex flex-col items-center gap-0.5 py-2';

          if (item.href?.startsWith('/')) {
            return (
              <Link key={item.label} to={item.href} className={className}>
                {inner}
              </Link>
            );
          }

          if (item.href) {
            return (
              <a key={item.label} href={item.href} className={className}>
                {inner}
              </a>
            );
          }

          return (
            <button key={item.label} type="button" onClick={() => handleAction(item)} className={className}>
              {inner}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

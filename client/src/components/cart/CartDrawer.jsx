import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  MapPin,
  Plus,
  Trash2,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react';
import useCartStore, { getItemId, getItemPrice } from '../../store/useCartStore';
import { API_BASE } from '../../services/apiConfig';

const MotionDiv = motion.div;

const steps = ['Patient', 'Address', 'Slot', 'Review'];
const timeGroups = [
  {
    label: 'Morning',
    slots: [
      { id: 'm1', timeWindow: '06:00 AM - 08:00 AM', demand: 'Fast Filling' },
      { id: 'm2', timeWindow: '08:00 AM - 10:00 AM', demand: 'Available' },
    ],
  },
  {
    label: 'Afternoon',
    slots: [
      { id: 'a1', timeWindow: '12:00 PM - 02:00 PM', demand: 'Available' },
      { id: 'a2', timeWindow: '02:00 PM - 04:00 PM', demand: 'Available' },
    ],
  },
];

const buildUpcomingDays = () => Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index);
  return {
    id: date.toISOString().slice(0, 10),
    day: index === 0 ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
    dateLabel: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    raw: date,
  };
});

const emptyMember = { name: '', age: '', gender: 'Male', relation: 'Self' };
const emptyAddress = { tag: 'Home', fullAddress: '', city: '', pincode: '', landmark: '' };

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userData') || 'null');
  } catch {
    return null;
  }
};

const buildContactFromUser = (user) => ({
  name: user?.name || user?.fullName || '',
  phone: String(user?.phone || user?.mobile || user?.userPhone || '').replace(/\D/g, '').slice(-10),
  email: user?.email || user?.userEmail || '',
});

const CartDrawer = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const familyMembers = useCartStore((state) => state.familyMembers);
  const addFamilyMember = useCartStore((state) => state.addFamilyMember);
  const itemPatientMap = useCartStore((state) => state.itemPatientMap);
  const assignPatientToItem = useCartStore((state) => state.assignPatientToItem);
  const savedAddresses = useCartStore((state) => state.savedAddresses);
  const selectedAddress = useCartStore((state) => state.selectedAddress);
  const addAddress = useCartStore((state) => state.addAddress);
  const setAddress = useCartStore((state) => state.setAddress);
  const selectedSlot = useCartStore((state) => state.selectedSlot);
  const setSlot = useCartStore((state) => state.setSlot);
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const checkoutStep = useCartStore((state) => state.checkoutStep);
  const setCheckoutStep = useCartStore((state) => state.setCheckoutStep);
  const previousCheckoutStep = useCartStore((state) => state.previousCheckoutStep);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const [memberForm, setMemberForm] = useState(emptyMember);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [selectedDay, setSelectedDay] = useState(() => buildUpcomingDays()[0]);
  const [contactForm, setContactForm] = useState(() => buildContactFromUser(getStoredUser()));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const contentRef = useRef(null);

  const days = useMemo(() => buildUpcomingDays(), []);
  const selectedAddressDetails = savedAddresses.find((item) => item.id === selectedAddress);
  const originalTotal = totalPrice * 2;
  const savings = originalTotal - totalPrice;
  const coins = Math.min(100, Math.floor(totalPrice * 0.03));
  const payable = Math.max(totalPrice - coins, 0);

  useEffect(() => {
    if (!isCartOpen) return;
    const storedContact = buildContactFromUser(getStoredUser());
    setContactForm((current) => ({
      name: current.name || storedContact.name || familyMembers[0]?.name || '',
      phone: current.phone || storedContact.phone || '',
      email: current.email || storedContact.email || '',
    }));
  }, [isCartOpen, familyMembers]);

  useEffect(() => {
    if (!isCartOpen || familyMembers.length === 0 || cartItems.length === 0) return;

    const defaultPatientId = familyMembers[0].id;
    cartItems.forEach((item) => {
      const itemId = getItemId(item);
      if (itemId && !itemPatientMap[itemId]) {
        assignPatientToItem(itemId, defaultPatientId);
      }
    });
  }, [assignPatientToItem, cartItems, familyMembers, isCartOpen, itemPatientMap]);

  if (!isCartOpen) return null;

  const setStepSafely = (stepIndex) => {
    if (stepIndex <= checkoutStep) {
      setCheckoutStep(stepIndex);
      setError('');
    }
  };

  const validateMemberForm = () => {
    if (!memberForm.name.trim()) return 'Patient name is required.';
    if (!memberForm.age || Number(memberForm.age) <= 0) return 'Valid patient age is required.';
    if (!memberForm.relation.trim()) return 'Relation is required.';
    return '';
  };

  const addMember = () => {
    const message = validateMemberForm();
    if (message) {
      setError(message);
      return;
    }

    const member = { ...memberForm, id: `member-${Date.now()}`, age: Number(memberForm.age) };
    addFamilyMember(member);
    cartItems.forEach((item) => {
      const itemId = getItemId(item);
      if (itemId) assignPatientToItem(itemId, member.id);
    });
    setContactForm((current) => ({
      ...current,
      name: current.name || member.name,
    }));
    setMemberForm(emptyMember);
    setError('');
  };

  const getEffectiveContact = () => {
    const storedContact = buildContactFromUser(getStoredUser());
    return {
      name: (contactForm.name || storedContact.name || familyMembers[0]?.name || '').trim(),
      phone: (contactForm.phone || storedContact.phone || '').trim(),
      email: (contactForm.email || storedContact.email || '').trim(),
    };
  };

  const validateAddressForm = () => {
    if (!addressForm.fullAddress.trim()) return 'Full address is required.';
    if (!addressForm.city.trim()) return 'City is required.';
    if (!/^\d{6}$/.test(addressForm.pincode.trim())) return 'Valid 6 digit pincode is required.';
    return '';
  };

  const saveAddress = () => {
    const message = validateAddressForm();
    if (message) {
      setError(message);
      return;
    }

    addAddress({
      ...addressForm,
      pincode: addressForm.pincode.trim(),
      fullAddress: addressForm.landmark.trim()
        ? `${addressForm.fullAddress.trim()}, ${addressForm.landmark.trim()}`
        : addressForm.fullAddress.trim(),
    });
    setAddressForm(emptyAddress);
    setError('');
  };

  const validateStep = () => {
    if (checkoutStep === 0) {
      if (familyMembers.length === 0) return 'Add at least one patient.';
      const unassigned = cartItems.some((item) => !itemPatientMap[getItemId(item)]);
      if (unassigned) return 'Select a patient for each test/package to continue.';
      const contact = getEffectiveContact();
      if (!contact.name) return 'Contact name is required.';
      if (!/^\d{10}$/.test(contact.phone)) return 'Valid 10 digit mobile number is required.';
      if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) return 'Valid email address is required.';
    }

    if (checkoutStep === 1 && !selectedAddressDetails) {
      return 'Add and select a collection address.';
    }

    if (checkoutStep === 2 && !selectedSlot) {
      return 'Choose a collection slot.';
    }

    return '';
  };

  const continueCheckout = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setCheckoutStep(Math.min(checkoutStep + 1, 3));
    requestAnimationFrame(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const confirmBooking = async () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }

    setSubmitting(true);
    setError('');

    const primaryItem = cartItems[0];
    const primaryPatient = familyMembers.find((member) => member.id === itemPatientMap[getItemId(primaryItem)]) || familyMembers[0];
    const assignedPatients = familyMembers.filter((member) => (
      cartItems.some((item) => itemPatientMap[getItemId(item)] === member.id)
    ));
    const userData = getStoredUser();
    const contact = getEffectiveContact();

    const payload = {
      customer: userData?._id || userData?.id,
      userName: primaryPatient?.name || contact.name,
      userEmail: contact.email,
      userPhone: contact.phone,
      contactName: contact.name,
      selectedPackage: cartItems.map((item) => item.title || item.name).join(', '),
      age: primaryPatient?.age,
      gender: primaryPatient?.gender,
      address: `${selectedAddressDetails.fullAddress}, ${selectedAddressDetails.city} - ${selectedAddressDetails.pincode}`,
      totalAmount: payable,
      paymentStatus: paymentMethod === 'ONLINE' ? 'PENDING' : 'CASH_ON_COLLECTION',
      status: 'Confirmed',
      bookingDate: selectedSlot.date,
      collectionAddress: selectedAddressDetails,
      slot: {
        date: selectedSlot.date,
        timeWindow: selectedSlot.timeWindow,
      },
      patients: (assignedPatients.length ? assignedPatients : familyMembers).map((member) => ({
        patientName: member.name,
        age: Number(member.age),
        gender: member.gender,
        relation: member.relation,
      })),
    };

    try {
      const response = await fetch(`${API_BASE}/api/bookings/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Booking failed');
      setConfirmedBooking(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const finishBooking = () => {
    clearCart();
    setConfirmedBooking(null);
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-[550]">
      <button className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={closeCart} aria-label="Close cart overlay" />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[960px] flex-col bg-white text-slate-900 shadow-2xl">
        {confirmedBooking ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-8">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-600">Booking confirmed</p>
                <h2 className="mt-1 text-2xl font-black">Your home collection is scheduled</h2>
              </div>
              <button onClick={finishBooking} className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-8">
              <div className="mx-auto max-w-2xl rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto text-emerald-600" size={48} />
                <h3 className="mt-4 text-xl font-black text-slate-950">Booking ID: {confirmedBooking.bookingId || confirmedBooking._id}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Our team will call {contactForm.phone} before visiting for sample collection.
                </p>
              </div>

              <div className="mx-auto mt-5 grid max-w-2xl gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Patient</p>
                  <p className="mt-2 font-black">{familyMembers.map((member) => member.name).join(', ')}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Slot</p>
                  <p className="mt-2 font-black">{selectedSlot.timeWindow}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 md:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Address</p>
                  <p className="mt-2 font-black">{selectedAddressDetails.fullAddress}, {selectedAddressDetails.city} - {selectedAddressDetails.pincode}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-5 md:p-6">
              <button onClick={finishBooking} className="flex h-12 w-full items-center justify-center rounded-lg bg-teal-600 text-sm font-black uppercase tracking-[0.08em] text-white">
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-200 px-5 py-4 md:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-600">Checkout</p>
                  <h2 className="mt-1 text-2xl font-black md:text-3xl">Complete your booking</h2>
                </div>
                <button onClick={closeCart} className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900" aria-label="Close cart">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step}
                    onClick={() => setStepSafely(index)}
                    className={`min-h-10 rounded-lg px-2 text-[10px] font-black transition md:text-xs ${checkoutStep === index ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {index + 1}. {step}
                  </button>
                ))}
              </div>
            </div>

            <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-5 md:px-8">
              {error && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  {error}
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <h3 className="text-lg font-black">Cart is empty</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    Add a package or test to start booking a home sample collection.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <MotionDiv
                    key={checkoutStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {checkoutStep === 0 && (
                      <section className="space-y-5">
                        <div>
                          <h3 className="text-lg font-black">Contact details</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">Used for visit updates and report delivery.</p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                          <input value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} placeholder="Full name *" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-500 md:col-span-1" />
                          <input value={contactForm.phone} maxLength={10} onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value.replace(/\D/g, '') })} placeholder="Mobile number *" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                          <input value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} placeholder="Email for report" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                        </div>

                        <div className="rounded-lg border border-slate-200 p-4">
                          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-black">Patient details</h3>
                              <p className="mt-1 text-sm font-semibold text-slate-500">Add every patient who will take a test.</p>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-[1.2fr_0.6fr_0.8fr_0.9fr_auto]">
                            <input value={memberForm.name} onChange={(event) => setMemberForm({ ...memberForm, name: event.target.value })} placeholder="Patient name *" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                            <input value={memberForm.age} onChange={(event) => setMemberForm({ ...memberForm, age: event.target.value.replace(/\D/g, '') })} placeholder="Age *" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                            <select value={memberForm.gender} onChange={(event) => setMemberForm({ ...memberForm, gender: event.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500">
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                            </select>
                            <input value={memberForm.relation} onChange={(event) => setMemberForm({ ...memberForm, relation: event.target.value })} placeholder="Relation *" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                            <button onClick={addMember} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-black text-white">
                              <Plus size={16} /> Add
                            </button>
                          </div>

                          {familyMembers.length > 0 && (
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                              {familyMembers.map((member) => (
                                <div key={member.id} className="rounded-lg border border-slate-200 bg-white p-3">
                                  <div className="flex items-center gap-3">
                                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-600"><UserRound size={17} /></span>
                                    <div>
                                      <h4 className="text-sm font-black">{member.name}</h4>
                                      <p className="text-xs font-bold text-slate-500">{member.relation} | {member.age} yrs | {member.gender}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {cartItems.map((item) => {
                            const itemId = getItemId(item);
                            return (
                              <article key={itemId} className="rounded-lg border border-slate-200 p-4">
                                <div className="mb-4 flex items-start justify-between gap-3">
                                  <div>
                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-teal-600">{item.type || 'PACKAGE'}</span>
                                    <h3 className="mt-3 text-base font-black leading-snug">{item.title || item.name}</h3>
                                    <p className="mt-1 text-xs font-bold text-slate-500">Rs. {getItemPrice(item).toLocaleString()}</p>
                                  </div>
                                  <button onClick={() => removeItem(itemId)} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:text-rose-500" aria-label="Remove item"><Trash2 size={16} /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {familyMembers.map((member) => (
                                    <button
                                      key={member.id}
                                      onClick={() => assignPatientToItem(itemId, member.id)}
                                      className={`rounded-full px-3 py-2 text-xs font-black ${itemPatientMap[itemId] === member.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                                    >
                                      {member.name}
                                    </button>
                                  ))}
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {checkoutStep === 1 && (
                      <section className="space-y-5">
                        <div>
                          <h3 className="text-lg font-black">Collection address</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">Enter a complete address for home sample collection.</p>
                        </div>

                        <div className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-2">
                          <select value={addressForm.tag} onChange={(event) => setAddressForm({ ...addressForm, tag: event.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500">
                            <option>Home</option>
                            <option>Office</option>
                            <option>Other</option>
                          </select>
                          <input value={addressForm.pincode} maxLength={6} onChange={(event) => setAddressForm({ ...addressForm, pincode: event.target.value.replace(/\D/g, '') })} placeholder="Pincode *" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                          <textarea value={addressForm.fullAddress} onChange={(event) => setAddressForm({ ...addressForm, fullAddress: event.target.value })} placeholder="House no, street, area *" className="min-h-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500 md:col-span-2" />
                          <input value={addressForm.landmark} onChange={(event) => setAddressForm({ ...addressForm, landmark: event.target.value })} placeholder="Landmark" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                          <input value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} placeholder="City *" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-500" />
                          <button onClick={saveAddress} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-black text-white md:col-span-2">
                            <Plus size={16} /> Save and select address
                          </button>
                        </div>

                        {savedAddresses.length > 0 && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {savedAddresses.map((address) => (
                              <button key={address.id} onClick={() => setAddress(address.id)} className={`rounded-lg border p-4 text-left ${selectedAddress === address.id ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`}>
                                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-teal-600"><MapPin size={13} /> {address.tag}</span>
                                <h4 className="text-sm font-black">{address.city}</h4>
                                <p className="mt-2 text-xs font-bold leading-5 text-slate-500">{address.fullAddress}</p>
                                <p className="mt-2 text-xs font-black text-slate-900">{address.pincode}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </section>
                    )}

                    {checkoutStep === 2 && (
                      <section className="space-y-5">
                        <div>
                          <h3 className="text-lg font-black">Choose collection slot</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">Pick a convenient date and time for sample collection.</p>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {days.map((day) => (
                            <button key={day.id} onClick={() => setSelectedDay(day)} className={`min-w-24 rounded-lg border px-4 py-3 text-center ${selectedDay.id === day.id ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`}>
                              <span className="block text-xs font-black">{day.day}</span>
                              <span className="mt-1 block text-xs font-bold text-slate-500">{day.dateLabel}</span>
                            </button>
                          ))}
                        </div>

                        <div className="space-y-4">
                          {timeGroups.map((group) => (
                            <div key={group.label}>
                              <h4 className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{group.label}</h4>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {group.slots.map((slot) => {
                                  const slotId = `${selectedDay.id}-${slot.id}`;
                                  const isSelected = selectedSlot?.id === slotId;
                                  return (
                                    <button key={slotId} onClick={() => setSlot({ ...slot, id: slotId, date: selectedDay.raw })} className={`rounded-lg border p-4 text-left ${isSelected ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`}>
                                      <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-black">{slot.timeWindow}</span>
                                        {slot.demand === 'Fast Filling' && <span className="rounded-full bg-amber-500 px-2 py-1 text-[9px] font-black uppercase text-white">Fast Filling</span>}
                                      </div>
                                      <p className="mt-2 text-xs font-bold text-slate-500">Home collection available</p>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {checkoutStep === 3 && (
                      <section className="space-y-5">
                        <div>
                          <h3 className="text-lg font-black">Review booking</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">Confirm details before saving the booking in database.</p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-lg border border-slate-200 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Contact</p>
                            <p className="mt-2 font-black">{contactForm.name}</p>
                            <p className="text-sm font-semibold text-slate-500">{contactForm.phone}</p>
                          </div>
                          <div className="rounded-lg border border-slate-200 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Slot</p>
                            <p className="mt-2 font-black">{selectedSlot?.timeWindow}</p>
                            <p className="text-sm font-semibold text-slate-500">{selectedSlot?.date?.toLocaleDateString?.('en-IN')}</p>
                          </div>
                          <div className="rounded-lg border border-slate-200 p-4 md:col-span-2">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Address</p>
                            <p className="mt-2 font-black">{selectedAddressDetails?.fullAddress}, {selectedAddressDetails?.city} - {selectedAddressDetails?.pincode}</p>
                          </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                          <div className="space-y-3 text-sm font-bold">
                            <div className="flex justify-between"><span className="text-slate-500">MRP total</span><span className="line-through">Rs. {originalTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Discount saved</span><span className="text-emerald-600">- Rs. {savings.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Health coins</span><span className="text-teal-600">- Rs. {coins}</span></div>
                            <div className="border-t border-slate-200 pt-3">
                              <div className="flex justify-between text-lg font-black"><span>Payable</span><span>Rs. {payable.toLocaleString()}</span></div>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button onClick={() => setPaymentMethod('ONLINE')} className={`rounded-lg border p-4 text-left ${paymentMethod === 'ONLINE' ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`}>
                            <CreditCard className="mb-3 text-teal-600" size={22} />
                            <h4 className="font-black">Pay Online</h4>
                            <p className="mt-1 text-xs font-bold text-slate-500">UPI, cards, wallets</p>
                          </button>
                          <button onClick={() => setPaymentMethod('CASH_ON_COLLECTION')} className={`rounded-lg border p-4 text-left ${paymentMethod === 'CASH_ON_COLLECTION' ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`}>
                            <WalletCards className="mb-3 text-teal-600" size={22} />
                            <h4 className="font-black">Cash on Collection</h4>
                            <p className="mt-1 text-xs font-bold text-slate-500">Pay to phlebotomist</p>
                          </button>
                        </div>
                      </section>
                    )}
                  </MotionDiv>
                </AnimatePresence>
              )}
            </div>

            <div className="border-t border-slate-200 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Total</span>
                <span className="text-2xl font-black">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              {error && (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                {checkoutStep > 0 && (
                  <button onClick={previousCheckoutStep} className="grid h-12 w-12 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500">
                    <ArrowLeft size={18} />
                  </button>
                )}
                <button
                  onClick={checkoutStep === 3 ? confirmBooking : continueCheckout}
                  disabled={cartItems.length === 0 || submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {checkoutStep === 3 ? (
                    <>
                      {submitting ? 'Saving...' : 'Confirm booking'} {!submitting && <Check size={18} />}
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;

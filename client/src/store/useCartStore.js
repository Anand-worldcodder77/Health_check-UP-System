import { create } from 'zustand';

const getItemId = (item) => item?._id || item?.id || item?.slug || item?.name || item?.title;
const getItemPrice = (item) => Number(item?.offerPrice ?? item?.discountedPrice ?? item?.price ?? 0);

const useCartStore = create((set, get) => ({
  cartItems: [],
  patientDetails: null,
  familyMembers: [],
  savedAddresses: [],
  itemPatientMap: {},
  selectedAddress: null,
  selectedPincode: '',
  selectedSlot: null,
  paymentMethod: 'ONLINE',
  confirmedBooking: null,
  checkoutStep: 0,
  isCartOpen: false,

  addItem: (item) => set((state) => {
    const itemId = getItemId(item);
    if (!itemId) return state;

    const exists = state.cartItems.some((cartItem) => getItemId(cartItem) === itemId);
    if (exists) return { ...state, isCartOpen: true };

    return {
      cartItems: [...state.cartItems, item],
      isCartOpen: true,
    };
  }),

  removeItem: (itemId) => set((state) => ({
    cartItems: state.cartItems.filter((item) => getItemId(item) !== itemId),
    itemPatientMap: Object.fromEntries(
      Object.entries(state.itemPatientMap).filter(([key]) => key !== itemId)
    ),
  })),

  setPincode: (pincode) => set({ selectedPincode: pincode }),
  setPatient: (patient) => set({ patientDetails: patient }),
  addFamilyMember: (member) => set((state) => ({
    familyMembers: [
      ...state.familyMembers,
      { ...member, id: member.id || `member-${Date.now()}` },
    ],
  })),
  assignPatientToItem: (itemId, patientId) => set((state) => ({
    itemPatientMap: { ...state.itemPatientMap, [itemId]: patientId },
  })),
  addAddress: (address) => set((state) => {
    const id = address.id || `address-${Date.now()}`;
    return {
      savedAddresses: [
        ...state.savedAddresses,
        { ...address, id },
      ],
      selectedAddress: id,
      selectedPincode: address.pincode || state.selectedPincode,
    };
  }),
  setAddress: (addressId) => set((state) => {
    const address = state.savedAddresses.find((item) => item.id === addressId);
    return {
      selectedAddress: addressId,
      selectedPincode: address?.pincode || state.selectedPincode,
    };
  }),
  setSlot: (slot) => set({ selectedSlot: slot }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setConfirmedBooking: (confirmedBooking) => set({ confirmedBooking }),
  setCheckoutStep: (checkoutStep) => set({ checkoutStep }),
  nextCheckoutStep: () => set((state) => ({ checkoutStep: Math.min(state.checkoutStep + 1, 3) })),
  previousCheckoutStep: () => set((state) => ({ checkoutStep: Math.max(state.checkoutStep - 1, 0) })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  clearCart: () => set({
    cartItems: [],
    patientDetails: null,
    itemPatientMap: {},
    selectedSlot: null,
    selectedAddress: null,
    confirmedBooking: null,
    checkoutStep: 0,
  }),

  getTotalPrice: () => get().cartItems.reduce((total, item) => total + getItemPrice(item), 0),
}));

export default useCartStore;
export { getItemId, getItemPrice };

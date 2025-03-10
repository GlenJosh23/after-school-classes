<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LessonList from './components/LessonList.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import type { Lesson, CartItem, CheckoutForm } from './types';

const lessons = ref<Lesson[]>([]);
const cartItems = ref<CartItem[]>([]);
const showCart = ref(false);
const showConfirmation = ref(false);

// Mock data for development
const mockLessons: Lesson[] = [
  {
    id: 1,
    subject: "Mathematics",
    location: "Room 101",
    price: 25,
    spaces: 5,
    image: "https://placehold.co/600x400?text=Mathematics"
  },
  {
    id: 2,
    subject: "Science",
    location: "Lab 201",
    price: 30,
    spaces: 8,
    image: "https://placehold.co/600x400?text=Science"
  },
  {
    id: 3,
    subject: "English",
    location: "Room 102",
    price: 20,
    spaces: 10,
    image: "https://placehold.co/600x400?text=English"
  },
  {
    id: 4,
    subject: "Art",
    location: "Studio 301",
    price: 35,
    spaces: 6,
    image: "https://placehold.co/600x400?text=Art"
  },
  {
    id: 5,
    subject: "Music",
    location: "Music Hall",
    price: 40,
    spaces: 4,
    image: "https://placehold.co/600x400?text=Music"
  },
  {
    id: 6,
    subject: "Physical Education",
    location: "Gym",
    price: 15,
    spaces: 15,
    image: "https://placehold.co/600x400?text=PE"
  },
  {
    id: 7,
    subject: "Computer Science",
    location: "Computer Lab",
    price: 45,
    spaces: 7,
    image: "https://placehold.co/600x400?text=CS"
  },
  {
    id: 8,
    subject: "History",
    location: "Room 103",
    price: 25,
    spaces: 12,
    image: "https://placehold.co/600x400?text=History"
  },
  {
    id: 9,
    subject: "Chemistry",
    location: "Lab 202",
    price: 35,
    spaces: 6,
    image: "https://placehold.co/600x400?text=Chemistry"
  },
  {
    id: 10,
    subject: "Literature",
    location: "Library",
    price: 20,
    spaces: 9,
    image: "https://placehold.co/600x400?text=Literature"
  }
];

onMounted(() => {
  // Use mock data instead of fetching
  lessons.value = mockLessons;
});

const addToCart = (lesson: Lesson) => {
  if (lesson.spaces > 0) {
    const existingItem = cartItems.value.find(item => item.id === lesson.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.value.push({ ...lesson, quantity: 1 });
    }
    
    // Update available spaces
    const lessonToUpdate = lessons.value.find(l => l.id === lesson.id);
    if (lessonToUpdate) {
      lessonToUpdate.spaces--;
    }
  }
};

const removeFromCart = (lessonId: number) => {
  const itemIndex = cartItems.value.findIndex(item => item.id === lessonId);
  if (itemIndex > -1) {
    const item = cartItems.value[itemIndex];
    
    // Restore spaces
    const lessonToUpdate = lessons.value.find(l => l.id === lessonId);
    if (lessonToUpdate) {
      lessonToUpdate.spaces += item.quantity;
    }
    
    cartItems.value.splice(itemIndex, 1);
  }
};

const handleCheckout = async (form: CheckoutForm) => {
  try {
    // Process the form data (you can send it to an API or log it)
    console.log('Form submitted:', form);

    // Simulate successful checkout
    showConfirmation.value = true;
    cartItems.value = [];
    showCart.value = false;
  } catch (error) {
    console.error('Checkout failed:', error);
  }
};

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">After School Classes</h1>
        <button
          @click="showCart = !showCart"
          :disabled="cartItems.length === 0"
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Cart ({{ cartItems.length }})
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="showConfirmation" class="bg-green-100 border-green-500 border p-4 rounded mb-4">
        Thank you for your order! We'll contact you shortly with confirmation details.
      </div>

      <template v-if="showCart">
        <ShoppingCart
          :cartItems="cartItems"
          :removeFromCart="removeFromCart"
          v-model:showCart="showCart"
          @checkout="handleCheckout"
        />
      </template>
      <template v-else>
        <LessonList
          :lessons="lessons"
          :addToCart="addToCart"
        />
      </template>
    </main>
  </div>
</template>

<style>

</style>
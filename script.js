document.addEventListener('DOMContentLoaded', function() {
    // Constants and Configuration
    const OWNER_EMAIL = "mohamedfaiyas11@gmail.com";
    const BOOKING_FORM_URL = "https://formsubmit.co/ajax/" + OWNER_EMAIL;
    const CONTACT_FORM_URL = "https://formsubmit.co/ajax/" + OWNER_EMAIL;
    
    
    // Distance data for routes (in km)
    const routeDistances = {
        pondicherry: {
            auroville: 12,
            chennai_airport: 150,
            chennai_city: 160,
            mahabalipuram: 95,
            thanjavur: 170
        },
        auroville: {
            pondicherry: 12,
            chennai_airport: 143,
            chennai_city: 155,
            mahabalipuram: 85,
            thanjavur: 180
        },
        chennai_airport: {
            pondicherry: 150,
            auroville: 143,
            chennai_city: 15,
            mahabalipuram: 60,
            thanjavur: 285
        },
        chennai_city: {
            pondicherry: 160,
            auroville: 155,
            chennai_airport: 15,
            mahabalipuram: 55,
            thanjavur: 295
        },
        mahabalipuram: {
            pondicherry: 95,
            auroville: 85,
            chennai_airport: 60,
            chennai_city: 55,
            thanjavur: 265
        },
        thanjavur: {
            pondicherry: 170,
            auroville: 180,
            chennai_airport: 285,
            chennai_city: 295,
            mahabalipuram: 265
        }
    };

    // Tariff data for different vehicle types
    const vehicleTariff = {
        sedan: {
            one_way: { ratePerKm: 14, driverBata: 400 },
            round_trip: { ratePerKm: 13, driverBata: 400 }
        },
        suv: {
            one_way: { ratePerKm: 19, driverBata: 400 },
            round_trip: { ratePerKm: 17, driverBata: 400 }
        },
        assured_innova: {
            one_way: { ratePerKm: 20, driverBata: 400 },
            round_trip: { ratePerKm: 18, driverBata: 400 }
        },
        innova_crysta: {
            one_way: { ratePerKm: 23, driverBata: 500 },
            round_trip: { ratePerKm: 20, driverBata: 500 }
        },
        tempo: {
            one_way: { ratePerKm: 0, driverBata: 0 }, // Not available for one-way
            round_trip: { ratePerKm: 22, driverBata: 500 }
        },
        bus: {
            one_way: { ratePerKm: 28, driverBata: 600 },
            round_trip: { ratePerKm: 25, driverBata: 600 }
        }
    };

    // DOM Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.menu');
    const themeToggle = document.getElementById('theme-toggle');
    const calculateFareBtn = document.getElementById('calculate-fare');
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeBookingModalBtn = document.getElementById('close-booking-modal');

    // Mobile Menu Toggle
    mobileMenuBtn?.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Theme Toggle
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Tariff Calculator
    calculateFareBtn?.addEventListener('click', () => {
        const pickup = document.getElementById('pickup-location').value;
        const drop = document.getElementById('drop-location').value;
        const vehicleType = document.getElementById('vehicle-type');
        const journeyType = document.getElementById('journey-type').value;

        if (!pickup || !drop || !vehicleType.value) {
            alert('Please fill all the required fields');
            return;
        }

        const rate = parseFloat(vehicleType.selectedOptions[0].dataset.rate);
        const distance = calculateDistance(pickup, drop); // This would use Google Maps API
        const baseFare = distance * rate;
        const tax = baseFare * 0.05;
        const totalFare = baseFare + tax;
        const multiplier = journeyType === 'round_trip' ? 2 : 1;

        document.getElementById('base-fare').textContent = `₹ ${(baseFare * multiplier).toFixed(2)}`;
        document.getElementById('distance').textContent = `${(distance * multiplier).toFixed(2)} km`;
        document.getElementById('tax-amount').textContent = `₹ ${(tax * multiplier).toFixed(2)}`;
        document.getElementById('fare-amount').textContent = `₹ ${(totalFare * multiplier).toFixed(2)}`;
    });

    // Booking Form Submission
    bookingForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('booking-submit');
        const submitText = document.getElementById('booking-submit-text');
        const spinner = document.getElementById('booking-spinner');

        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        spinner.style.display = 'inline-block';

        try {
            // Collect form data
            const bookingData = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value,
                date: document.getElementById('booking-date').value,
                time: document.getElementById('pickup-time').value,
                pickup: document.getElementById('booking-pickup').value,
                drop: document.getElementById('booking-drop').value,
                vehicle: document.getElementById('booking-vehicle').value,
                instructions: document.getElementById('special-instructions').value
            };

            // Generate booking ID
            const bookingId = 'BK' + Date.now().toString().slice(-6);

            // Update modal with booking details
            document.getElementById('modal-booking-id').textContent = bookingId;
            document.getElementById('modal-name').textContent = bookingData.name;
            document.getElementById('modal-phone').textContent = bookingData.phone;
            document.getElementById('modal-date').textContent = bookingData.date;
            document.getElementById('modal-time').textContent = bookingData.time;
            document.getElementById('modal-route').textContent = `${bookingData.pickup} to ${bookingData.drop}`;
            document.getElementById('modal-vehicle').textContent = bookingData.vehicle;

            // Show modal
            bookingModal.style.display = 'block';
            
            // Reset form
            bookingForm.reset();

        } catch (error) {
            alert('An error occurred while processing your booking. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.style.display = 'inline-block';
            spinner.style.display = 'none';
        }
    });

    // Contact Form Submission
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('contact-submit');
        const submitText = document.getElementById('contact-submit-text');
        const spinner = document.getElementById('contact-spinner');

        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        spinner.style.display = 'inline-block';

        try {
            // Collect form data
            const contactData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };

            // Here you would typically send the data to your server
            // For now, we'll just show a success message
            alert('Thank you for your message. We will get back to you soon!');
            contactForm.reset();

        } catch (error) {
            alert('An error occurred while sending your message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.style.display = 'inline-block';
            spinner.style.display = 'none';
        }
    });

    // Modal Close Buttons
    closeModalBtn?.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    closeBookingModalBtn?.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Google Maps Integration
let map;
let directionsService;
let directionsRenderer;
let pickupAutocomplete;
let dropAutocomplete;

function initializeMap() {
    // Initialize map centered on Pondicherry
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 11.9416, lng: 79.8083 },
        zoom: 13
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Initialize autocomplete for pickup and drop locations
    pickupAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('pickup-location')
    );
    dropAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('drop-location')
    );

    // Add listeners
    document.getElementById('calculate-fare').addEventListener('click', calculateFare);
}

async function calculateFare() {
    const pickup = document.getElementById('pickup-location').value;
    const drop = document.getElementById('drop-location').value;
    const vehicleSelect = document.getElementById('vehicle-type');
    const journeyType = document.getElementById('journey-type').value;
    
    if (!pickup || !drop || !vehicleSelect.value) {
        alert('Please fill in all fields');
        return;
    }

    const selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
    const ratePerKm = parseFloat(selectedOption.dataset.rate);

    try {
        const route = await getRoute(pickup, drop);
        const distanceInKm = route.distance.value / 1000;
        const multiplier = journeyType === 'round_trip' ? 2 : 1;
        
        let baseFare = distanceInKm * ratePerKm * multiplier;
        const gst = baseFare * 0.05;
        const totalFare = baseFare + gst;

        // Update fare display
        document.getElementById('distance').textContent = `${distanceInKm.toFixed(2)} km`;
        document.getElementById('base-fare').textContent = `₹ ${baseFare.toFixed(2)}`;
        document.getElementById('tax-amount').textContent = `₹ ${gst.toFixed(2)}`;
        document.getElementById('fare-amount').textContent = `₹ ${totalFare.toFixed(2)}`;

        // Draw route on map
        directionsRenderer.setDirections(route.rawResponse);
    } catch (error) {
        alert('Error calculating route. Please try again.');
        console.error(error);
    }
}

function getRoute(origin, destination) {
    return new Promise((resolve, reject) => {
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: 'DRIVING'
            },
            (result, status) => {
                if (status === 'OK') {
                    resolve({
                        distance: result.routes[0].legs[0].distance,
                        duration: result.routes[0].legs[0].duration,
                        rawResponse: result
                    });
                } else {
                    reject(status);
                }
            }
        );
    });
}

// Initialize map when the page loads
window.addEventListener('load', initializeMap);

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use device preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme.matches)) {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
});

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});
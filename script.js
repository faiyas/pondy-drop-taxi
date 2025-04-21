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

    // Initialize UI Components
    initMobileMenu();
    initBackToTopButton();
    initSmoothScrolling();
    initDatePicker();
    initTariffCalculator();
    initBookingForm();
    initContactForm();
    initTestimonialSlider();
    initModalCloseHandlers();

    // Mobile Menu Toggle
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
            });
        }
    }

    // Back to Top Button
    function initBackToTopButton() {
        const backToTopBtn = document.querySelector('.back-to-top');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });
            
            backToTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // Smooth Scrolling for Navigation Links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a, .hero a');
        
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        const mobileMenu = document.querySelector('.menu');
                        if (mobileMenu) mobileMenu.classList.remove('active');
                    }
                }
            });
        });
    }

    // Initialize Date Picker with Min Date as Today
    function initDatePicker() {
        const bookingDateInput = document.getElementById('booking-date');
        if (bookingDateInput) {
            const today = new Date().toISOString().split('T')[0];
            bookingDateInput.setAttribute('min', today);
        }
    }

    // Tariff Calculator Functionality
    function initTariffCalculator() {
        const calculateFareBtn = document.getElementById('calculate-fare');
        const pickupLocation = document.getElementById('pickup-location');
        const dropLocation = document.getElementById('drop-location');
        const vehicleType = document.getElementById('vehicle-type');
        const journeyType = document.getElementById('journey-type');
        const fareAmount = document.getElementById('fare-amount');
        const baseFare = document.getElementById('base-fare');
        const distance = document.getElementById('distance');
        const taxAmount = document.getElementById('tax-amount');
            console.log('Calculator elements:', {
        btn: calculateFareBtn,
        pickup: pickupLocation,
        drop: dropLocation,
        vehicle: vehicleType,
        journey: journeyType
    });
    
    // Ensure elements exist before adding event listeners
    if (!calculateFareBtn || !pickupLocation || !dropLocation || !vehicleType || !journeyType) {
        console.error('One or more tariff calculator elements not found');
        return;
    }
    

        // Update vehicle options when journey type changes
        if (journeyType) {
            journeyType.addEventListener('change', function() {
                const selectedJourneyType = this.value;
                const tempoOption = Array.from(vehicleType.options).find(option => option.value === 'tempo');
                
                if (tempoOption) {
                    if (selectedJourneyType === 'one_way') {
                        tempoOption.disabled = true;
                        if (vehicleType.value === 'tempo') {
                            vehicleType.value = '';
                        }
                    } else {
                        tempoOption.disabled = false;
                    }
                }
            });
        }

        // Calculate fare when button is clicked
        if (calculateFareBtn) {
            calculateFareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                calculateFare();
            });
                calculateFareBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        calculateFare();
    });
        }
            calculateFareBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        calculateFare();
    });

        function calculateFare() {
            const pickup = pickupLocation.value;
            const drop = dropLocation.value;
            const vehicle = vehicleType.value;
            const journey = journeyType.value;
            
            // Validate inputs
            if (!pickup || !drop || !vehicle || !journey) {
                showAlert('Please fill in all fields to calculate the fare.');
                return;
            }
            
            if (pickup === drop) {
                showAlert('Pickup and drop locations cannot be the same.');
                return;
            }
            
            if (vehicle === 'tempo' && journey === 'one_way') {
                showAlert('Tempo Traveller is not available for one-way trips.');
                return;
            }
            
            // Calculate distance
            let travelDistance = 0;
            if (routeDistances[pickup] && routeDistances[pickup][drop]) {
                travelDistance = routeDistances[pickup][drop];
            } else {
                showAlert('Route information not available.');
                return;
            }
            
            // Get tariff details
            const tariff = vehicleTariff[vehicle][journey];
            
            // Calculate fare
            let distanceFare = travelDistance * tariff.ratePerKm;
            let totalFare = distanceFare + tariff.driverBata;
            
            // For round trips, the distance is doubled
            if (journey === 'round_trip') {
                travelDistance = travelDistance * 2;
                distanceFare = travelDistance * tariff.ratePerKm;
                totalFare = distanceFare + tariff.driverBata;
            }
            
            // Calculate GST (5%)
            const gstAmount = totalFare * 0.05;
            totalFare += gstAmount;
            
            // Update UI
            if (distance) distance.textContent = `${travelDistance} km`;
            if (baseFare) baseFare.textContent = `₹ ${(distanceFare + tariff.driverBata).toFixed(2)}`;
            if (taxAmount) taxAmount.textContent = `₹ ${gstAmount.toFixed(2)}`;
            if (fareAmount) fareAmount.textContent = `₹ ${totalFare.toFixed(2)}`;
        }
    }

    // Booking Form Submission
    function initBookingForm() {
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                clearErrors();
                
                // Get form values
                const bookingData = {
                    bookingId: 'PDT' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
                    name: document.getElementById('customer-name').value.trim(),
                    phone: document.getElementById('customer-phone').value.trim(),
                    email: document.getElementById('customer-email').value.trim(),
                    date: document.getElementById('booking-date').value,
                    time: document.getElementById('pickup-time').value,
                    pickupLocation: document.getElementById('booking-pickup').value,
                    dropLocation: document.getElementById('booking-drop').value,
                    vehicleType: document.getElementById('booking-vehicle').value,
                    specialInstructions: document.getElementById('special-instructions').value.trim(),
                    
                    // FormSubmit configuration
                    _subject: `New Taxi Booking - ${document.getElementById('customer-name').value.trim()}`,
                    _template: "table",
                    _captcha: "false",
                    _replyto: document.getElementById('customer-email').value.trim(),
                    _autoresponse: generateBookingConfirmationEmail()
                };

                // Validate inputs
                let isValid = true;
                
                if (!bookingData.name) {
                    showError('customer-name', 'Please enter your name');
                    isValid = false;
                }
                
                if (!validatePhone(bookingData.phone)) {
                    showError('customer-phone', 'Please enter a valid phone number (10-15 digits)');
                    isValid = false;
                }

                if (!validateEmail(bookingData.email)) {
                    showError('customer-email', 'Please enter a valid email address');
                    isValid = false;
                }
                
                if (!isValid) return;

                // Show loading state
                const submitBtn = document.getElementById('booking-submit');
                const submitText = document.getElementById('booking-submit-text');
                const spinner = document.getElementById('booking-spinner');
                
                toggleLoadingState(submitBtn, submitText, spinner, true);

                try {
                    const response = await fetch(BOOKING_FORM_URL, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(bookingData)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok && result.success) {
                        updateBookingModal(bookingData);
                        document.getElementById('booking-modal').style.display = 'block';
                        bookingForm.reset();
                        
                        // Show success message
                        showAlert('Booking confirmed! A confirmation has been sent to your email.', 'success');
                    } else {
                        throw new Error(result.message || 'Booking failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert('Booking failed. Please try again or contact us directly at +91 98765 43210.');
                } finally {
                    toggleLoadingState(submitBtn, submitText, spinner, false);
                }
            });
        }

        function generateBookingConfirmationEmail() {
            return `Dear ${document.getElementById('customer-name').value.trim()},

Thank you for booking with Pondy DropTaxi! Here are your booking details:

- Booking ID: PDT${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
- Pickup: ${document.getElementById('booking-pickup').options[document.getElementById('booking-pickup').selectedIndex].text}
- Drop: ${document.getElementById('booking-drop').options[document.getElementById('booking-drop').selectedIndex].text}
- Date: ${document.getElementById('booking-date').value}
- Time: ${document.getElementById('pickup-time').value}
- Vehicle: ${document.getElementById('booking-vehicle').options[document.getElementById('booking-vehicle').selectedIndex].text}

Your driver will contact you at ${document.getElementById('customer-phone').value.trim()} before pickup.

For any changes, please call us at +91 90252 32453.

Safe travels!
Pondy DropTaxi Team`;
        }
    }

    // Contact Form Submission
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                clearErrors();
                
                const contactData = {
                    name: document.getElementById('contact-name').value.trim(),
                    email: document.getElementById('contact-email').value.trim(),
                    subject: document.getElementById('contact-subject').value.trim(),
                    message: document.getElementById('contact-message').value.trim(),
                    _subject: `New Contact: ${document.getElementById('contact-subject').value.trim()}`,
                    _template: "table",
                    _captcha: "false",
                    _replyto: document.getElementById('contact-email').value.trim()
                };

                // Validate inputs
                let isValid = true;
                
                if (!contactData.name) {
                    showError('contact-name', 'Please enter your name');
                    isValid = false;
                }
                
                if (!validateEmail(contactData.email)) {
                    showError('contact-email', 'Please enter a valid email address');
                    isValid = false;
                }
                
                if (!contactData.subject) {
                    showError('contact-subject', 'Please enter a subject');
                    isValid = false;
                }
                
                if (!contactData.message) {
                    showError('contact-message', 'Please enter your message');
                    isValid = false;
                }
                
                if (!isValid) return;

                // Show loading state
                const submitBtn = document.getElementById('contact-submit');
                const submitText = document.getElementById('contact-submit-text');
                const spinner = document.getElementById('contact-spinner');
                
                toggleLoadingState(submitBtn, submitText, spinner, true);

                try {
                    const response = await fetch(CONTACT_FORM_URL, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(contactData)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok && result.success) {
                        showAlert('Thank you for your message! We will get back to you within 24 hours.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error(result.message || 'Message failed to send');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert('Message failed to send. Please call us directly at +91 98765 43210.');
                } finally {
                    toggleLoadingState(submitBtn, submitText, spinner, false);
                }
            });
        }
    }

    // Testimonial Slider
    function initTestimonialSlider() {
        let testimonialIndex = 0;
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (testimonialCards.length > 0) {
            testimonialCards.forEach((card, index) => {
                if (index !== 0) card.style.display = 'none';
            });
            
            setInterval(() => {
                testimonialCards[testimonialIndex].style.display = 'none';
                testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
                testimonialCards[testimonialIndex].style.display = 'block';
            }, 5000);
        }
    }

    // Modal Close Handlers
    function initModalCloseHandlers() {
        const closeModal = document.getElementsByClassName('close-modal')[0];
        const closeModalBtn = document.getElementById('close-booking-modal');
        const bookingModal = document.getElementById('booking-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                bookingModal.style.display = 'none';
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                bookingModal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', function(event) {
            if (event.target === bookingModal) {
                bookingModal.style.display = 'none';
            }
        });
    }

    // Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(String(phone));
    }

    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            element.parentNode.appendChild(errorElement);
            
            // Remove error on input
            element.addEventListener('input', function() {
                element.classList.remove('error');
                if (errorElement.parentNode) {
                    errorElement.parentNode.removeChild(errorElement);
                }
            });
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    function toggleLoadingState(button, textElement, spinnerElement, isLoading) {
        if (button && textElement && spinnerElement) {
            button.disabled = isLoading;
            if (button.id === 'booking-submit') {
                textElement.textContent = isLoading ? 'Processing...' : 'Book Now';
            } else {
                textElement.textContent = isLoading ? 'Sending...' : 'Send Message';
            }
            spinnerElement.style.display = isLoading ? 'inline-block' : 'none';
        }
    }

    function showAlert(message, type = 'error') {
        // Remove any existing alerts first
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();
        
        // Create a custom alert div
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert ${type}`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    function updateBookingModal(bookingData) {
        document.getElementById('modal-booking-id').textContent = bookingData.bookingId;
        document.getElementById('modal-name').textContent = bookingData.name;
        document.getElementById('modal-phone').textContent = bookingData.phone;
        document.getElementById('modal-date').textContent = formatDate(bookingData.date);
        document.getElementById('modal-time').textContent = formatTime(bookingData.time);
        document.getElementById('modal-route').textContent = 
            `${getLocationName(bookingData.pickupLocation)} to ${getLocationName(bookingData.dropLocation)}`;
        document.getElementById('modal-vehicle').textContent = getVehicleName(bookingData.vehicleType);
        
        // Calculate estimated fare for display
        let estimatedFare = 'Will be confirmed shortly';
        if (routeDistances[bookingData.pickupLocation] && routeDistances[bookingData.pickupLocation][bookingData.dropLocation]) {
            const travelDistance = routeDistances[bookingData.pickupLocation][bookingData.dropLocation];
            const tariff = vehicleTariff[bookingData.vehicleType]['one_way'];
            let fare = (travelDistance * tariff.ratePerKm) + tariff.driverBata;
            fare += fare * 0.05; // Add 5% GST
            estimatedFare = `₹ ${fare.toFixed(2)}`;
        }
        document.getElementById('modal-fare').textContent = estimatedFare;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${period}`;
    }

    function getLocationName(locationValue) {
        const locationMap = {
            'pondicherry': 'Pondicherry',
            'auroville': 'Auroville',
            'chennai_airport': 'Chennai Airport',
            'chennai_city': 'Chennai City',
            'mahabalipuram': 'Mahabalipuram',
            'thanjavur': 'Thanjavur'
        };
        return locationMap[locationValue] || locationValue;
    }

    function getVehicleName(vehicleValue) {
        const vehicleMap = {
            'sedan': 'Sedan (4 Seater)',
            'suv': 'SUV (6 Seater)',
            'assured_innova': 'Assured Innova',
            'innova_crysta': 'Innova Crysta',
            'tempo': 'Tempo Traveller (12 Seater)',
            'bus': 'Mini Bus (20 Seater)'
        };
        return vehicleMap[vehicleValue] || vehicleValue;
    }
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
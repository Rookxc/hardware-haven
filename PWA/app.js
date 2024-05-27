const baseUrl = 'http://localhost:3000/';
var accessToken;

displayItems();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service Worker registered:', reg);
                var serviceWorker;
                if (reg.installing) {
                    serviceWorker = reg.installing;
                } else if (reg.waiting) {
                    serviceWorker = reg.waiting;
                } else if (reg.active) {
                    serviceWorker = reg.active;
                }

                if (serviceWorker) {
                    if (serviceWorker.state == "activated") {
                        subscribe(reg);
                    }
                }
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

function subscribe(registration) {
    console.log('Subscribed');

    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('BGhOI3HPFMfeRwGMG9h7kexDfLt8xjYpGfL_ma-WfkuS-n9fYLCh3WPIWRmj4VnxVMrP61bt1TtJjc_tOxfpGiM')
                })
                    .then(function (subscription) {
                        sendSubscriptionToServer(subscription);
                    })
                    .catch(function (err) {
                        console.error('Failed to subscribe the user: ', err);
                    });
            }
        });
    }
}

function sendSubscriptionToServer(subscription) {
    fetchData('push-notifications/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
        .then(response => {
            if (response.message !== 'Subscription successful') {
                console.error('Failed to subscribe: ', response.message, response.error);
            }
        })
        .catch(error => {
            console.error('Error subscribing user:', error);
        });
}

function sendPushNotification(title, message) {
    new Notification(title, {
        body: message,
        icon: 'icons/logo_192.png'
    });
}

function sendPushNotificationToServer(title, message) {
    fetchData('push-notifications/send-push-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            body: message
        })
    }).then((resp) => {
        console.log(resp.message);
    });
}

async function fetchData(url, options = {}) {
    if (accessToken === undefined && url !== 'users/login') {
        await login();
    }

    try {
        if (accessToken !== undefined && accessToken !== null) {
            if (options['headers'] === undefined) {
                options['headers'] = {};
            }

            options['headers']['Authorization'] = 'Bearer ' + accessToken;
        }

        const response = await fetch(baseUrl + url, options);
        return response.json();
    } catch (error) {
        console.warn('Error fetching data:', error);
        return { error: 'An unexpected error has occurred. Please try again later.' };
    }
}

window.addEventListener('online', () => {
    document.getElementById('offline-warning').style.display = 'none';
    document.getElementById('add-button').disabled = false;
    document.getElementById('delete-button').disabled = false;
    document.getElementById('save-button').disabled = false;
});

window.addEventListener('offline', () => {
    document.getElementById('offline-warning').style.display = 'block';
    document.getElementById('add-button').disabled = true;
    document.getElementById('delete-button').disabled = true;
    document.getElementById('save-button').disabled = true;
});

async function login() {
    const loginResponse = await fetchData('users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'alen@test.si',
            password: 'test'
        })
    });

    accessToken = loginResponse.accessToken;
}

async function displayItems(items = []) {
    if (items.length === 0) {
        const productsResponse = await fetchData('products', {
            method: 'GET'
        });
        items = productsResponse;
    }

    const itemsList = document.getElementById('items-list');

    itemsList.innerHTML = '';
    if (items.length > 0) {
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price} €</span>
                </div>
            `;
            listItem.addEventListener('click', () => openEditItemModal(item));
            itemsList.appendChild(listItem);
        });
    }
}

const modal = document.getElementById('item-modal');
const closeButton = document.getElementsByClassName('close');
const saveButton = document.getElementById('save-button');
const deleteButton = document.getElementById('delete-button');
const itemIdInput = document.getElementById('item-hidden-id');
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const itemError = document.getElementById('item-error');

document.getElementById('add-button').addEventListener('click', openAddItemModal);

function openAddItemModal() {
    document.getElementById('modal-title').textContent = 'Add New Item';
    itemIdInput.value = '';
    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemError.style.display = 'none';
    modal.style.display = 'block';
    deleteButton.style.display = 'none';
}

function openEditItemModal(item) {
    document.getElementById('modal-title').textContent = 'Edit Item';
    itemIdInput.value = item.id;
    itemNameInput.value = item.name;
    itemPriceInput.value = item.price;
    itemError.style.display = 'none';
    modal.style.display = 'block';
    deleteButton.style.display = 'block';
}

Array.from(closeButton).forEach((e) => {
    e.addEventListener('click', () => {
        hideModal();
    });
});

function hideModal() {
    Array.from(document.getElementsByClassName('modal')).forEach((e) => {
        e.style.display = 'none';
    });
}

saveButton.addEventListener('click', async () => {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value.trim());

    if (!name || isNaN(price) || price <= 0) {
        itemError.innerHTML = 'Please enter valid name and price.';
        itemError.style.display = 'block';
        return;
    }

    itemError.style.display = 'none';

    if (itemIdInput.value.length > 0) {
        const resp = await fetchData('products/' + itemIdInput.value, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: itemNameInput.value,
                price: parseFloat(itemPriceInput.value)
            })
        });
        sendPushNotification('Update product', resp.message);
    } else {
        const resp = await fetchData('products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: itemNameInput.value,
                price: parseFloat(itemPriceInput.value)
            })
        });
        sendPushNotification('Add product', resp.message);
    }

    displayItems();
    modal.style.display = 'none';
});

deleteButton.addEventListener('click', async () => {
    if (itemIdInput.value.length > 0) {
        const resp = await fetchData('products/' + itemIdInput.value, {
            method: 'DELETE'
        });
        sendPushNotification('Delete product', resp.message);
    } else {
        itemError.innerHTML = 'Cannot delete this item.';
        itemError.style.display = 'block';
    }

    displayItems();
    modal.style.display = 'none';
});

document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    if (query.length === 0) {
        displayItems();
    } else {
        const filteredItems = await fetchData('products/find/' + query, {
            method: 'GET'
        });

        if (filteredItems.error || (filteredItems.length === 0 && query.length > 0)) {
            var itemDetails = document.querySelectorAll('.item-details');

            itemDetails.forEach(function (itemDetail) {
                var itemName = itemDetail.querySelector('.item-name').textContent;
                if (!itemName.toLowerCase().includes(query.toLowerCase())) {
                    itemDetail.parentNode.style.display = 'none';
                } else {
                    itemDetail.parentNode.style.display = 'block';
                }
            });
        } else {
            displayItems(filteredItems);
        }
    }
});

// bližnjice
let combinationTriggered = false;

document.addEventListener('keydown', function (event) {
    if (!combinationTriggered && event.ctrlKey && event.key === 'a') {
        // Ctrl + A: Dodajanje
        openAddItemModal();
        combinationTriggered = true;
    } else if (!combinationTriggered && event.ctrlKey && event.key === 's' && modal.style.display === 'block') {
        // Ctrl + S: Shranjevanje
        event.preventDefault();
        saveButton.click();
        combinationTriggered = true;
    } else if (!combinationTriggered && event.ctrlKey && event.key === 'x') {
        event.preventDefault();
        sendPushNotificationToServer('Test notification', 'Hello from server!');
        combinationTriggered = true;
    }
});

document.addEventListener('keyup', function (event) {
    combinationTriggered = false;
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('.lazy');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                img.setAttribute('src', src);
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(image => {
        observer.observe(image);
    });
}

document.addEventListener('DOMContentLoaded', lazyLoadImages);

function speak(message) {
    console.log('speaking: ', message);
    var toSpeak = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(toSpeak);
}

// annyang
if(annyang && window.speechSynthesis) {
    var commands = {
        'Hello': () => {
            speak('Hello');
        },
        '(Hello) My name is *tag': (tag) => {
            speak('Hello ' + tag);
        },
        '(Please) search *tag': (tag) => {
            speak('Searching ' + tag);
            document.getElementById('search-input').value = tag;
            document.getElementById('search-button').click();
        },
        '(Please) clear search': () => {
            speak('Cleared search');
            document.getElementById('search-input').value = '';
            document.getElementById('search-button').click();
        },
        '(Please) click *tag': (tag) => {
            if(tag === 'close') {
                hideModal();
                speak('Clicking ' + tag);
                return;
            }

            const element = document.getElementById(tag.toLowerCase() + '-button');
            if(element) {
                element.click();
                speak('Clicking ' + tag);
            } else {
                speak('Button not found');
            }
        },
        '(Please) help': () => {
            document.getElementById('help-button').click();
            speak('Showing help');
        },
        '(Please) set *value to (item) *input': (value, input) => {
            if(input && value && document.getElementById('item-' + input)) {
                document.getElementById('item-' + input).value = value;
                speak('Setting ' + value + ' to ' + input);
            } else {
                speak('Please repeat');
            }
        },
        '(Please) add *value to (item) *input': (value, input) => {
            if(input && value && document.getElementById('item-' + input)) {
                if(input === 'price') {
                    if(document.getElementById('item-price').value === '') {
                        speak("Price isn't set yet");
                        return;
                    }

                    if(isNaN(value)) {
                        speak('Please repeat');
                        return;
                    } else {
                        newValue = parseFloat(value) + parseFloat(document.getElementById('item-' + input).value);
                        document.getElementById('item-' + input).value = newValue;
                    }
                } else {
                    document.getElementById('item-' + input).value += ' ' + value;
                }

                speak('Adding ' + value + ' to ' + input);
            } else {
                speak('Please repeat');
            }
        },
        '(Please) subtract *value from (item) price': (value) => {
            if(document.getElementById('item-price').value === '') {
                speak("Price isn't set yet");
                return;
            }

            if(value) {
                if(isNaN(value)) {
                    speak('Please repeat');
                    return;
                } else {
                    newValue = parseFloat(document.getElementById('item-price').value) - parseFloat(value);
                    console.log(newValue);
                    if(newValue < 0) {
                        speak("Price can't be lower than 0");
                        return;
                    }
                    document.getElementById('item-price').value = newValue;
                }

                speak('Subtracting ' + value + ' from price');
            } else {
                speak('Please repeat');
            }
        }
    };

    annyang.addCommands(commands);
    annyang.start();
}

document.getElementById('help-button').addEventListener('click', async () => {
    document.getElementById('help-modal').style.display = 'block';
});
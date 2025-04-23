// filepath: 
export const initiatePayment = async (cartItems, totalAmount) => {
    try {
        const response = await fetch('https://e-commerce-api-i2ak.onrender.com/api/payments/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalAmount, cart: cartItems }),
        });
        const order = await response.json();

        if (order.id) {
            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY // Fetch the Razorpay key
            console.log('Razorpay Key:', razorpayKey); // Debug the key

            const options = {
                key: razorpayKey, // Use the environment variable
                amount: order.amount,
                currency: order.currency,
                name: 'E-Commerce Store',
                description: 'Test Transaction',
                order_id: order.id,
                handler: function (response) {
                    alert('Payment successful!');
                    console.log(response);
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999',
                },
            };
            const razorpay = new Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                alert('Payment failed!');
                console.error(response.error);
            });
            razorpay.open();
        }
    } catch (error) {
        console.error('Error during payment initiation:', error);
    }
};
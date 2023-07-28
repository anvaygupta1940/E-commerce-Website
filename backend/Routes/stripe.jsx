const router = require("express").Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY_MY)
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_MY);

// when we make any payment stripe will return a tokenId
router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            console("Backend stripe error");
            res.status(500).json(stripeErr);
        } else {
            res.status(200).json(stripeRes);
        }
    })
})
module.exports = router;


const express = require('express');
const router = express.Router();

// base template
router.get('/', (req, res) => {
    res.status(200).render('base', {
        title: "Exciting tours for adventurous people"
    });
})

router.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: "Overview"
    });
})
router.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: "All Tours"
    });
})

module.exports = router;
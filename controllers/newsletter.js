const NewsletterSubscriber = require('../model/NewsletterSubscriber')
const  {renderNewsletterSubscriptionTemplate} = require("../template/subscribed")
const  {bravo_sendEmail} = require("../services/bravoemail")
const subscribeNewsletter = async (req, res) => {
  try {
    let { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    email = String(email).trim().toLowerCase()

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      })
    }

    // check existing
    const existingSubscriber = await NewsletterSubscriber.findOne({ email })

    return res.status(201).json({
      success: true,
      message: 'You have subscribed successfully',
     
    })

    const subscriber = await NewsletterSubscriber.create({ email })
 const emailRes = await bravo_sendEmail({
        to: email,
        subject: "Thanks for subscribing to Abanise News",
        html: renderNewsletterSubscriptionTemplate({})
    })
    console.log(emailRes);
    
    return res.status(201).json({
      success: true,
      message: 'You have subscribed successfully',
      data: subscriber
    })
  } catch (error) {
    console.error('SUBSCRIBE NEWSLETTER ERROR:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to subscribe'
    })
  }
}

module.exports = {
  subscribeNewsletter
}
const Mailchimp = require("mailchimp-api-v3");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const mailchimp = new Mailchimp(process.env.MAILCHIMP_KEY);

exports.signUpMailchimp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  try {
    await mailchimp.post(`/lists/${process.env.MAILCHIMP_ID}`, {
      members: [
        {
          email_address: email,
          status: "subscribed"
        }
      ]
    });
    res.status(200).json({
      status: "success",
      data: {
        message: "Your have been added to our mailing list"
      }
    });
  } catch (error) {
    return next(
      new AppError("There was an error adding you to our mailing list", 500)
    );
  }
});


export const isAuthenticated = async (
  req,
  res,
  next
) => {
  try {
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    if (req.session.authUserId) {
      return next();
    }
    return res
      .status(403)
      .json({ isAuth: false, msg: "You are not logged in" });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const forwardAuthentication = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  if (!req.session.authUserId) {
    return next();
  }

  if (req.session.authUserId) {
    return res.status(304).json({ msg: "Already Logged In", isAuth: true });
  }
};

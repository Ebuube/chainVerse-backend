const nodemailer = require('nodemailer');

const isProd = String(process.env.NODE_ENV).toLowerCase() === 'production';

const getEmailAuth = () => {
	const user = (process.env.EMAIL_USER || '').trim();
	// Google “App Passwords” are often copied with spaces; normalize them.
	const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim();
	return { user, pass };
};

const createTransport = () => {
	const { user, pass } = getEmailAuth();
	return nodemailer.createTransport({
		service: 'gmail',
		auth: { user, pass },
	});
};

exports.sendEmail = async (email, verificationCode, subject, message = '') => {
	try {
		const { user, pass } = getEmailAuth();
		if (!user || !pass) {
			if (isProd) {
				throw new Error('Email credentials are missing (set EMAIL_USER and EMAIL_PASS)');
			}
			console.warn('Email credentials missing; skipping sendEmail in non-production');
			return false;
		}

		const transport = createTransport();
		const info = await transport.sendMail({
			from: user,
			to: email,
			subject: subject,
			html: `<h1>Your ${subject} Code: ${verificationCode}</h1> <p>${message}</p>`,
		});

		// If email is successfully sent
		if (info.accepted.includes(email)) {
			return true;
		}
		return false;
	} catch (error) {
		console.error('Error sending email:', error.message);
		if (isProd) {
			throw new Error(error.message);
		}
		return false;
	}
};

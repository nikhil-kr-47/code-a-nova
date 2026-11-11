import Registration from '../models/Registration.js';
import transporter, { SENDER_NAME, SENDER_EMAIL } from '../config/mailer.js';
import { getRegistrationEmailTemplate } from '../utils/emailTemplates.js';

/**
 * @desc   Submit Hackathon Registration form
 * @route  POST /api/hackathon/register
 * @access Private
 */
export const registerHackathon = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      collegeName,
      course,
      branch,
      yearOfStudy,
      domainTrack,
      projectName,
      pptLink,
      prototypeLink,
      demoVideoLink,
      teamSize,
      teamMembers,
    } = req.body;

    // Check if user already has an active entry
    const existingRegistration = await Registration.findOne({ user: req.user._id });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a registration for Code-a-Nova 2026.',
        registrationId: existingRegistration.registrationId,
      });
    }

    // Validation
    if (!fullName || fullName.trim().length < 3 || !/^[A-Za-z\s]+$/.test(fullName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Full Name must be at least 3 characters and contain letters only.',
      });
    }

    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number.',
      });
    }

    if (!collegeName || !course || !branch || !yearOfStudy || !domainTrack) {
      return res.status(400).json({
        success: false,
        message: 'Academic details and domain track are required.',
      });
    }

    if (!projectName || projectName.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Project name must be at least 5 characters long.',
      });
    }

    if (!pptLink || !prototypeLink) {
      return res.status(400).json({
        success: false,
        message: 'Both presentation slide link and prototype link are mandatory.',
      });
    }

    const parsedTeamSize = parseInt(teamSize, 10) || 1;
    if (parsedTeamSize < 1 || parsedTeamSize > 5) {
      return res.status(400).json({
        success: false,
        message: 'Team size must be between 1 and 5 members.',
      });
    }

    // If team size > 1, validate team members
    let validatedMembers = [];
    if (parsedTeamSize > 1) {
      if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide details for each teammate.',
        });
      }

      for (let i = 0; i < teamMembers.length; i++) {
        const member = teamMembers[i];
        if (!member.name || !member.name.trim() || !member.email || !member.email.trim()) {
          return res.status(400).json({
            success: false,
            message: `Please complete Name and Email for teammate #${i + 1}.`,
          });
        }
        validatedMembers.push({
          name: member.name.trim(),
          email: member.email.toLowerCase().trim(),
        });
      }
    }

    // Generate readable registration ID: CAN-2026-XXXX
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const registrationId = `CAN-2026-${randomHex}`;

    // Create entry in MongoDB
    const newRegistration = await Registration.create({
      user: req.user._id,
      registrationId,
      fullName: fullName.trim(),
      email: (email || req.user.email).toLowerCase().trim(),
      mobileNumber: mobileNumber.trim(),
      collegeName: collegeName.trim(),
      course: course.trim(),
      branch: branch.trim(),
      yearOfStudy,
      domainTrack: domainTrack.trim(),
      projectName: projectName.trim(),
      pptLink: pptLink.trim(),
      prototypeLink: prototypeLink.trim(),
      demoVideoLink: demoVideoLink ? demoVideoLink.trim() : '',
      teamSize: parsedTeamSize,
      teamMembers: validatedMembers,
      status: 'Confirmed',
    });

    // Send confirmation email via Nodemailer
    try {
      const emailContent = getRegistrationEmailTemplate({
        fullName: newRegistration.fullName,
        registrationId,
        projectName: newRegistration.projectName,
        domainTrack: newRegistration.domainTrack,
        collegeName: newRegistration.collegeName,
        teamSize: newRegistration.teamSize,
        teamMembers: newRegistration.teamMembers,
      });

      await transporter.sendMail({
        from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
        to: newRegistration.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });
    } catch (mailError) {
      console.error('[Confirmation Email Error]: Failed to dispatch mail', mailError);
      // We don't fail the whole registration if email delivery is delayed, but log it
    }

    return res.status(201).json({
      success: true,
      message: 'Registration completed successfully! Confirmation email sent.',
      registration: newRegistration,
    });
  } catch (error) {
    console.error('[Hackathon Registration Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit registration.',
    });
  }
};

/**
 * @desc   Fetch currently logged-in user's registration
 * @route  GET /api/hackathon/my-entry
 * @access Private
 */
export const getMyEntry = async (req, res) => {
  try {
    const registration = await Registration.findOne({ user: req.user._id });
    return res.status(200).json({
      success: true,
      hasRegistered: !!registration,
      registration: registration || null,
    });
  } catch (error) {
    console.error('[Get My Entry Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve hackathon entry details.',
    });
  }
};

/**
 * @desc   Delete registration entry (optional / admin)
 * @route  DELETE /api/hackathon/:id
 * @access Private
 */
export const deleteEntry = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration entry not found or unauthorized to delete.',
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Registration entry was successfully deleted.',
    });
  } catch (error) {
    console.error('[Delete Entry Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete registration entry.',
    });
  }
};

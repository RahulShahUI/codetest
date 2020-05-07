import React, { Component } from "react";
import { Typography, Container } from "@material-ui/core";

class AdsTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Container className="container-root">
        <div className="common-box common-box-full">
          <div className="common-box-header">
            <Typography variant="h2">Ads & Tracking</Typography>
          </div>

          <div className="common-box-body">
            <p><strong>We Use Tracking Technology</strong><br />
              We collect personal information about users over time and across different websites when you use this website or service. We also have third parties that collect personal information this way. To do this, we – or vendors we have hired – use several common data collection technologies including cookies, pixel tags, and similar technologies. These technologies are used to understand the activities and behaviors of our consumers and website visitors. We do this for many reasons, including the following:</p>

            <ul>
              <li>To recognize new visitors to our websites</li>
              <li>To recognize past visitors</li>
              <li>To present more personalized content, to improve your website experience, optimize your browser experience, and provide site and service enhancements</li>
              <li>To serve customized advertising (whether on our website or others you visit)</li>
              <li>So we can better understand our audience, our customers, our website visitors, and their respective interests</li>
            </ul>

            <p><strong>We Engage in Interest-Based Advertising</strong><br />
              Frito-Lay displays interest-based advertising using information you make available to us when you interact with us or our partners. For example, we might look at your browsing behavior. We might look at these activities on our website or the websites of others. We work with third parties who help gather this information. This allows us to provide you with more useful and relevant ads. We (or our partners) gather this information on our platforms. These include websites, emails or apps. This information may also be gathered on third-party platforms.</p>

            <p><strong>You have Options Over the Interest Based Ads You See</strong><br />
              The third parties we work with participate in the Self-Regulatory Program for Online Behavioral Advertising. This program provides consumers with the ability to opt-out of having their online behavior recorded and used for advertising purposes. If you want to opt out, visit <a href="http://www.aboutads.info/choices/">http://www.aboutads.info/choices/</a>. Choices you make are browser and device specific.</p>

            <p><strong>How to Control Tracking Technology</strong><br />
              You may control our use of cookies. How you do so depends on the type of cookie. You can configure your browser to reject browser cookies. To control flash cookies go to <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html">http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html</a>. Why? Because flash cookies do not reside in your browser, and thus your browser settings will not affect them.</p>

            <p><strong><span>NOTE:</span></strong> If you configure your computer to block cookies, you may not be able to access certain functionality on our site. Options you select are browser and device specific, and if you block or delete cookies, not all of the tracking that we have described in this policy will stop.</p>

            <p>Some browsers have a “Do Not Track” feature that lets you tell websites that you do not want to have your online activities tracked. These features are not yet uniform, so we are not currently set up to respond to those signals.</p>
          </div>
        </div>
      </Container>
    );
  }
}

export default AdsTracking;
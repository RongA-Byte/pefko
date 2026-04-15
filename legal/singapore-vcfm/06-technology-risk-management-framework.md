# TECHNOLOGY AND CYBERSECURITY RISK MANAGEMENT FRAMEWORK

## Pefko Capital Management Pte. Ltd.

**In Compliance with MAS Technology Risk Management Guidelines**

---

**Version:** 1.0
**Effective Date:** [DATE]
**Approved by:** Board of Directors
**Next Review Date:** [DATE + 12 months]
**Classification:** Confidential

---

## TABLE OF CONTENTS

1. [Introduction and Purpose](#1-introduction-and-purpose)
2. [Governance and Oversight](#2-governance-and-oversight)
3. [Technology Risk Management](#3-technology-risk-management)
4. [IT Asset Management](#4-it-asset-management)
5. [Access Control](#5-access-control)
6. [Cybersecurity Operations](#6-cybersecurity-operations)
7. [Data Protection and Privacy](#7-data-protection-and-privacy)
8. [Incident Management](#8-incident-management)
9. [Business Continuity and Disaster Recovery](#9-business-continuity-and-disaster-recovery)
10. [Third-Party and Cloud Risk Management](#10-third-party-and-cloud-risk-management)
11. [Software Development and Change Management](#11-software-development-and-change-management)
12. [Physical Security](#12-physical-security)
13. [Training and Awareness](#13-training-and-awareness)
14. [Audit and Compliance](#14-audit-and-compliance)

---

## 1. INTRODUCTION AND PURPOSE

### 1.1 Purpose

This Technology and Cybersecurity Risk Management Framework (the "Framework") sets out the policies, procedures, and controls adopted by Pefko Capital Management Pte. Ltd. (the "Company") to manage technology and cybersecurity risks in its operations.

This Framework has been developed in compliance with the Monetary Authority of Singapore ("MAS") Technology Risk Management Guidelines ("TRM Guidelines") and is proportionate to the Company's size, nature, and complexity of operations as a Venture Capital Fund Manager.

### 1.2 Scope

This Framework applies to:
- All information technology systems, infrastructure, and services used by the Company
- All directors, officers, employees, representatives, and contractors of the Company
- All third-party service providers and vendors with access to the Company's systems or data
- All data processed, stored, or transmitted by or on behalf of the Company

### 1.3 Proportionality

As a VCFM with a small team and limited technology footprint, the Company adopts a risk-based, proportionate approach to technology risk management. The controls outlined in this Framework are scaled appropriately to the Company's operational profile while meeting MAS's expectations for sound technology risk governance.

### 1.4 Regulatory References

| Reference | Description |
|-----------|-------------|
| MAS Technology Risk Management Guidelines (January 2021, revised) | Primary regulatory framework for technology risk |
| MAS Notice on Cyber Hygiene | Minimum cybersecurity requirements for financial institutions |
| MAS Guidelines on Outsourcing | Requirements for outsourced technology services |
| Personal Data Protection Act 2012 ("PDPA") | Singapore data protection requirements |
| MAS Notice SFA 04-N02 | AML/CFT requirements (data security aspects) |

---

## 2. GOVERNANCE AND OVERSIGHT

### 2.1 Board of Directors

The Board of Directors bears ultimate responsibility for the Company's technology risk management. The Board shall:

(a) Approve this Technology Risk Management Framework and any material amendments;

(b) Ensure that technology risk management is treated as a priority, not solely an IT function;

(c) Receive regular updates on technology risk posture, incidents, and remediation;

(d) Allocate adequate resources and budget for technology risk management;

(e) Ensure that the Company's technology risk appetite is clearly defined and communicated; and

(f) Oversee the appointment and effectiveness of the technology risk management function.

### 2.2 Senior Management / CEO

The CEO is responsible for:

(a) Implementing the technology risk management framework approved by the Board;

(b) Ensuring technology risks are identified, assessed, and mitigated in day-to-day operations;

(c) Reporting material technology risks and incidents to the Board;

(d) Ensuring all staff comply with technology security policies; and

(e) Overseeing vendor and third-party technology risk management.

### 2.3 Technology Risk Owner

Given the Company's size, the CEO also serves as the primary Technology Risk Owner, with the following specific duties:

(a) Maintaining the technology risk register;

(b) Conducting periodic technology risk assessments;

(c) Overseeing the implementation of security controls;

(d) Managing technology vendor relationships from a risk perspective;

(e) Coordinating incident response; and

(f) Ensuring compliance with MAS TRM Guidelines.

*Note: The Company may appoint a dedicated IT/cybersecurity officer or engage an external technology risk consultant as the business grows.*

### 2.4 Risk Appetite

The Company has a **low** risk appetite for technology and cybersecurity risks. The Company will not accept:
- Unencrypted storage or transmission of sensitive data
- Systems without multi-factor authentication
- Unpatched critical vulnerabilities for more than 30 days
- Vendor arrangements without contractual security requirements
- Any compromise of investor personal or financial data

---

## 3. TECHNOLOGY RISK MANAGEMENT

### 3.1 Risk Assessment

The Company conducts a technology risk assessment at least annually, covering:

| Risk Category | Description | Current Rating |
|---------------|-------------|---------------|
| **Data Breach** | Unauthorized access to investor, fund, or corporate data | Medium |
| **Ransomware/Malware** | Compromise of systems through malicious software | Medium |
| **Phishing/Social Engineering** | Staff targeted by phishing or social engineering attacks | Medium |
| **Vendor/Third-Party** | Security failures at outsourced service providers | Medium |
| **Data Loss** | Loss of critical data due to hardware failure, human error, or disaster | Low-Medium |
| **Insider Threat** | Unauthorized access or data exfiltration by insiders | Low |
| **Business Disruption** | IT outage preventing business operations | Low-Medium |
| **Regulatory Non-Compliance** | Failure to meet MAS TRM or PDPA requirements | Low |

### 3.2 Risk Register

The Company maintains a technology risk register documenting:
- Identified technology risks
- Risk ratings (likelihood x impact)
- Control measures in place
- Residual risk ratings
- Risk owners
- Action items and timelines

The risk register is reviewed and updated at least quarterly.

### 3.3 Risk Mitigation Strategy

| Approach | When Applied |
|----------|-------------|
| **Mitigate** | Implement controls to reduce risk to acceptable level — primary approach |
| **Transfer** | Purchase cyber insurance for residual risks — applied for high-impact, low-probability events |
| **Accept** | Board-approved acceptance of low residual risks with documented justification |
| **Avoid** | Eliminate the risk by not undertaking the activity — applied for unacceptable risks |

---

## 4. IT ASSET MANAGEMENT

### 4.1 Asset Inventory

The Company maintains an inventory of all IT assets, including:

| Asset Category | Examples | Owner |
|---------------|----------|-------|
| **Hardware** | Laptops, mobile phones, external storage devices | Individual assignees |
| **Software** | Operating systems, applications, cloud services | CEO / IT function |
| **Data** | Investor data, fund data, corporate records, emails | Data classification owner |
| **Network** | Office network, VPN, Wi-Fi | CEO / IT function |
| **Accounts** | User accounts, service accounts, API keys | CEO / IT function |

### 4.2 Asset Classification

| Classification | Description | Examples |
|---------------|-------------|----------|
| **Confidential** | Highest sensitivity; unauthorized disclosure would cause significant harm | Investor PII, fund financial data, LP account details, AML/CFT records |
| **Internal** | For internal use only; not for public disclosure | Investment memos, Board papers, compliance reports, staff records |
| **Public** | May be shared externally | Marketing materials, public announcements |

### 4.3 Asset Lifecycle

- **Acquisition:** All IT assets must be approved and procured through the CEO/IT function
- **Configuration:** All devices configured to Company security standards before use
- **Maintenance:** Regular updates and patching
- **Disposal:** Secure data wiping before disposal; physical destruction of storage media containing confidential data

---

## 5. ACCESS CONTROL

### 5.1 Principles

- **Least Privilege:** Users are granted only the minimum access necessary to perform their duties
- **Need-to-Know:** Access to confidential data is restricted to authorized personnel with a business need
- **Segregation of Duties:** Critical functions are separated where practicable

### 5.2 Authentication

| Control | Requirement |
|---------|-------------|
| **Passwords** | Minimum 12 characters; complexity requirements (upper, lower, numeric, special); no password reuse (last 12) |
| **Multi-Factor Authentication (MFA)** | **Mandatory** for all systems — email, cloud services, fund management software, VPN, and any system containing investor or financial data |
| **Session Management** | Automatic session timeout after 15 minutes of inactivity; screen lock enforced |
| **Account Lockout** | Account locked after 5 consecutive failed authentication attempts |

### 5.3 User Access Management

| Process | Description | Frequency |
|---------|-------------|-----------|
| **Provisioning** | Access granted based on role definition; approved by CEO | Upon joining or role change |
| **Review** | All user access rights reviewed for appropriateness | At least semi-annually |
| **De-provisioning** | All access revoked immediately upon termination or departure | Same business day |
| **Privileged Access** | Administrative/root access strictly limited to designated personnel; logged and monitored | Quarterly review |

### 5.4 Remote Access

- Remote access permitted only via encrypted VPN or secure cloud services
- MFA mandatory for all remote access
- Personal devices used for work must comply with the Company's security standards (encryption, screen lock, up-to-date OS)
- No access to Company systems from public or shared computers

---

## 6. CYBERSECURITY OPERATIONS

### 6.1 Endpoint Security

| Control | Implementation |
|---------|---------------|
| **Anti-Malware** | Enterprise anti-malware installed on all Company devices; automatic updates; real-time scanning |
| **Endpoint Detection & Response (EDR)** | EDR solution deployed on all endpoints for advanced threat detection |
| **Full-Disk Encryption** | All laptops and mobile devices encrypted (e.g., BitLocker, FileVault) |
| **Device Management** | Mobile Device Management (MDM) for remote wipe capability on Company and BYOD devices |
| **Patch Management** | Critical security patches applied within 14 days; all other patches within 30 days |

### 6.2 Network Security

| Control | Implementation |
|---------|---------------|
| **Firewall** | Enterprise-grade firewall on office network; default-deny inbound policy |
| **Wi-Fi Security** | WPA3 encryption; separate guest network isolated from corporate network |
| **VPN** | All remote access through encrypted VPN |
| **DNS Filtering** | DNS-level filtering to block known malicious domains |

### 6.3 Email Security

| Control | Implementation |
|---------|---------------|
| **Email Provider** | Enterprise email service with built-in security (e.g., Google Workspace, Microsoft 365) |
| **Spam/Phishing Filtering** | Advanced email filtering for spam, phishing, and malware attachments |
| **DMARC/SPF/DKIM** | Email authentication configured to prevent spoofing |
| **Encryption** | TLS enforced for email in transit; S/MIME or PGP available for sensitive communications |

### 6.4 Vulnerability Management

| Activity | Frequency |
|----------|-----------|
| **Vulnerability scanning** (external) | At least quarterly |
| **Vulnerability scanning** (internal) | At least semi-annually |
| **Penetration testing** | At least annually, or after significant infrastructure changes |
| **Critical vulnerability remediation** | Within 14 days of identification |
| **Non-critical vulnerability remediation** | Within 30 days of identification |

---

## 7. DATA PROTECTION AND PRIVACY

### 7.1 Data Protection Policy

The Company processes personal data in compliance with the Personal Data Protection Act 2012 ("PDPA") and MAS requirements.

**Data Protection Officer:** [NAME / CEO]

### 7.2 Types of Data Processed

| Data Category | Examples | Classification | Retention |
|--------------|----------|---------------|-----------|
| **Investor PII** | Names, NRIC/passport, addresses, bank details | Confidential | 5 years after relationship ends |
| **Investor CDD** | Source of funds, beneficial ownership, PEP status | Confidential | 5 years after relationship ends |
| **Fund Financial Data** | NAVs, capital calls, distributions, valuations | Confidential | 7 years |
| **Portfolio Company Data** | Financials, strategy, IP information | Confidential | 7 years after exit |
| **Staff Data** | Employment records, payroll, performance | Confidential | 2 years after departure |
| **Corporate Records** | Board minutes, contracts, compliance records | Internal | Per statutory requirements |

### 7.3 Data Protection Controls

| Control | Description |
|---------|-------------|
| **Encryption at Rest** | All confidential data encrypted on disk (AES-256 or equivalent) |
| **Encryption in Transit** | All data transmissions encrypted (TLS 1.2+) |
| **Data Loss Prevention** | DLP policies on email and cloud storage to prevent unauthorized transmission of confidential data |
| **Data Backup** | Automated encrypted backups; tested restoration at least quarterly |
| **Data Disposal** | Secure deletion (overwrite) for electronic data; physical destruction for physical media |
| **Consent Management** | PDPA consent obtained for personal data collection and use |
| **Data Breach Notification** | PDPC notification within 3 business days of qualifying breach |

### 7.4 Cross-Border Data Transfers

The Company may transfer personal data outside Singapore in connection with fund operations (e.g., to fund administrators, legal counsel, or co-investors). All cross-border transfers shall:

(a) Comply with PDPA requirements for overseas transfers;
(b) Ensure the recipient provides a comparable standard of protection;
(c) Be subject to contractual obligations for data protection; and
(d) Be documented and monitored.

---

## 8. INCIDENT MANAGEMENT

### 8.1 Incident Classification

| Severity | Description | Examples | Response Time |
|----------|-------------|----------|---------------|
| **Critical** | Significant impact on operations, data, or regulatory compliance | Data breach involving investor PII; ransomware; complete system compromise | Immediate (within 1 hour) |
| **High** | Material impact on specific systems or data | Successful phishing attack; unauthorized access to confidential data; major vendor security incident | Within 4 hours |
| **Medium** | Contained incident with limited impact | Blocked malware attempt; minor unauthorized access attempt; employee device lost (encrypted) | Within 24 hours |
| **Low** | Minimal impact; no data compromise | Spam email; unsuccessful login attempts; minor software malfunction | Within 72 hours |

### 8.2 Incident Response Plan

**Phase 1: Detection and Reporting**
- Any person who detects or suspects a cybersecurity incident must immediately report it to the CEO/Technology Risk Owner
- All incidents are logged in the incident register

**Phase 2: Containment**
- Isolate affected systems to prevent spread
- Preserve evidence for investigation
- Activate incident response team (CEO + relevant staff + external support if needed)

**Phase 3: Investigation and Assessment**
- Determine the nature, scope, and impact of the incident
- Identify the root cause
- Assess whether personal data has been compromised

**Phase 4: Notification**
- **MAS notification:** Report technology incidents to MAS within 1 hour of discovery as required by MAS Notice on Cyber Hygiene (for qualifying incidents)
- **PDPC notification:** Notify PDPC within 3 business days if qualifying personal data breach (affecting ≥500 individuals or likely to cause significant harm)
- **Investor notification:** Notify affected investors if their personal or financial data has been compromised
- **Law enforcement:** Report to Singapore Police Force / Cyber Security Agency if criminal activity suspected

**Phase 5: Remediation**
- Implement corrective actions to address root cause
- Restore affected systems
- Update security controls as necessary

**Phase 6: Post-Incident Review**
- Conduct post-incident review within 14 days
- Document lessons learned
- Update this Framework and relevant policies as needed
- Report to Board of Directors

### 8.3 Incident Register

All cybersecurity incidents are recorded in the incident register with:
- Date and time of detection
- Description of incident
- Classification and severity
- Systems and data affected
- Actions taken (containment, investigation, remediation)
- Notifications made
- Root cause analysis
- Lessons learned and follow-up actions

---

## 9. BUSINESS CONTINUITY AND DISASTER RECOVERY

### 9.1 Business Continuity Plan (BCP)

The Company maintains a BCP to ensure continuity of critical operations in the event of disruption.

**Critical Business Functions:**

| Function | Recovery Time Objective (RTO) | Recovery Point Objective (RPO) |
|----------|------------------------------|-------------------------------|
| Email and communications | 4 hours | 1 hour |
| Fund management / portfolio data | 24 hours | 4 hours |
| Investor records and CDD | 24 hours | 4 hours |
| Financial records and accounting | 48 hours | 24 hours |
| Corporate records | 72 hours | 24 hours |

### 9.2 Disaster Recovery Measures

| Measure | Description |
|---------|-------------|
| **Cloud-Based Systems** | Primary systems hosted on enterprise cloud platforms with built-in redundancy |
| **Data Backup** | Automated daily backups; encrypted; stored in geographically separate location |
| **Backup Testing** | Restoration tested at least quarterly to verify backup integrity |
| **Remote Work** | All staff equipped to work remotely with full access to Company systems via VPN |
| **Communication** | Emergency contact list maintained; alternative communication channels identified |
| **Vendor BCP** | Critical vendors required to demonstrate BCP capabilities |

### 9.3 BCP Testing

The BCP is tested at least annually through:
- Tabletop exercise (scenario-based discussion)
- Technical recovery test (backup restoration, system failover)
- Communication test (emergency notification chain)

Test results are documented and reported to the Board.

---

## 10. THIRD-PARTY AND CLOUD RISK MANAGEMENT

### 10.1 Vendor Risk Assessment

Before engaging any technology vendor or service provider, the Company conducts a risk assessment covering:

(a) **Security posture:** Vendor's information security policies, certifications (SOC 2, ISO 27001), and controls;

(b) **Data handling:** How vendor processes, stores, and protects Company data;

(c) **Regulatory compliance:** Vendor's compliance with applicable regulations;

(d) **Business continuity:** Vendor's BCP and disaster recovery capabilities;

(e) **Jurisdiction:** Where data will be stored and processed; applicable data protection laws;

(f) **Financial stability:** Vendor's financial health and risk of business failure; and

(g) **Track record:** Vendor's security incident history and response capability.

### 10.2 Vendor Classification

| Classification | Criteria | Assessment Frequency |
|---------------|----------|---------------------|
| **Critical** | Processes confidential data; provides core business systems; failure would significantly impact operations | Annual detailed assessment |
| **Important** | Provides significant services; some access to Company data | Annual assessment |
| **Standard** | Limited scope; no access to confidential data | Assessment at onboarding |

### 10.3 Critical Vendors

| Vendor / Service | Classification | Key Controls |
|-----------------|---------------|-------------|
| Cloud email provider (e.g., Google Workspace / Microsoft 365) | Critical | SOC 2 Type II; encryption; MFA; DLP |
| Fund management software | Critical | SOC 2; encryption; access controls; backup |
| Fund administrator | Critical | Regulated entity; SOC 1/2; contractual security obligations |
| Cloud storage / document management | Critical | SOC 2; encryption at rest and in transit; access controls |
| Accounting software | Important | SOC 2; encryption; access controls |

### 10.4 Cloud Computing Controls

For all cloud services:

(a) Data encrypted at rest and in transit;
(b) MFA enforced for all accounts;
(c) Access controls configured based on least privilege;
(d) Logging and monitoring enabled;
(e) Data residency requirements documented and monitored;
(f) Exit strategy documented (data portability and deletion upon termination);
(g) SLAs reviewed for availability, security, and incident notification requirements.

### 10.5 Contractual Requirements

All technology vendor agreements must include:

- Confidentiality and data protection obligations
- Security requirements and standards
- Right to audit and inspect
- Incident notification requirements (within 24 hours of discovery)
- Sub-contracting restrictions or notification requirements
- Data return and secure deletion upon termination
- Business continuity commitments
- Compliance with applicable regulations

---

## 11. SOFTWARE DEVELOPMENT AND CHANGE MANAGEMENT

### 11.1 Applicability

The Company does not develop custom software internally. However, the following change management controls apply to all IT systems and configurations:

### 11.2 Change Management

| Change Type | Approval Required | Testing Required |
|------------|-------------------|-----------------|
| **Critical system configuration changes** | CEO approval | Testing in non-production (where available) |
| **New software / service deployment** | CEO approval | Evaluation and testing before deployment |
| **Security patches** | CEO notification (critical patches may be applied immediately) | Vendor-tested; monitoring after deployment |
| **User access changes** | CEO approval | Verification after implementation |

### 11.3 Change Records

All changes to IT systems and configurations are documented with:
- Description of the change
- Reason for the change
- Approval record
- Date of implementation
- Testing and verification results
- Rollback plan (where applicable)

---

## 12. PHYSICAL SECURITY

### 12.1 Office Security

| Control | Description |
|---------|-------------|
| **Access Control** | Office access restricted to authorised persons; key card or lock |
| **Visitor Management** | All visitors logged and escorted |
| **Clean Desk** | Confidential documents secured when not in use |
| **Document Disposal** | Confidential documents shredded; cross-cut shredder available |
| **Device Security** | Laptops locked when unattended; cable locks available |
| **CCTV** | Building-level CCTV (managed by building management) |

### 12.2 Equipment Security

- All portable devices (laptops, phones) must have full-disk encryption
- Company devices must not be left unattended in public places
- Lost or stolen devices must be reported immediately for remote wipe
- External storage devices (USB drives) — usage restricted; encrypted if permitted

---

## 13. TRAINING AND AWARENESS

### 13.1 Training Program

| Training | Audience | Frequency | Content |
|----------|----------|-----------|---------|
| **Cybersecurity awareness** | All staff | Annual + onboarding | Phishing recognition, password security, data handling, incident reporting |
| **Phishing simulation** | All staff | Semi-annual | Simulated phishing exercises to test awareness |
| **Technology risk management** | Board + senior management | Annual | Cyber threat landscape, regulatory updates, risk posture |
| **Incident response** | Incident response team | Annual | Incident response procedures, tabletop exercises |
| **Data protection** | All staff | Annual | PDPA compliance, data classification, data handling procedures |

### 13.2 Awareness Activities

- Regular cybersecurity reminders and tips (email/internal communication)
- Alerts on current threats and phishing campaigns
- Updates when policies or procedures change
- Post-incident communications and lessons learned

---

## 14. AUDIT AND COMPLIANCE

### 14.1 Internal Review

The CEO/Technology Risk Owner conducts an internal review of technology risk management controls at least annually, covering:

- Effectiveness of access controls
- Patch management compliance
- Backup and recovery testing results
- Vendor risk assessment status
- Incident history and response effectiveness
- Training completion rates
- Policy compliance

### 14.2 External Assessment

The Company shall arrange for an independent technology risk assessment:

- At least once every 3 years; or
- More frequently if directed by MAS or if material changes warrant it

The assessment shall be conducted by a qualified external cybersecurity firm or auditor.

### 14.3 MAS Reporting

The Company shall report technology incidents to MAS in accordance with MAS Notice on Cyber Hygiene and any other applicable requirements:

- Significant cyber incidents: within 1 hour of discovery
- Other reportable incidents: within the timeframe prescribed by MAS
- Annual technology risk assessment summary: as part of Form 25A or upon MAS request

### 14.4 Key Performance Indicators

| KPI | Target | Measurement |
|-----|--------|-------------|
| Critical patch compliance (within 14 days) | 100% | Monthly |
| MFA enforcement on all systems | 100% | Monthly |
| Staff cybersecurity training completion | 100% | Annual |
| Phishing simulation pass rate | >80% | Semi-annual |
| Backup restoration success rate | 100% | Quarterly |
| User access review completion | 100% | Semi-annual |
| Vendor security assessment completion | 100% (critical/important vendors) | Annual |
| Security incidents resolved within SLA | >95% | Quarterly |

---

## ANNEXES

### Annex A: Technology Risk Register Template

| Risk ID | Risk Description | Category | Likelihood | Impact | Risk Rating | Controls | Residual Rating | Owner | Action Items | Due Date |
|---------|-----------------|----------|-----------|--------|-------------|----------|----------------|-------|-------------|----------|
| TR-001 | [Description] | [Category] | [H/M/L] | [H/M/L] | [H/M/L] | [Controls] | [H/M/L] | [Name] | [Actions] | [Date] |

### Annex B: Incident Report Template

| Field | Details |
|-------|---------|
| Incident ID | |
| Date/Time Detected | |
| Detected By | |
| Description | |
| Classification | Critical / High / Medium / Low |
| Systems Affected | |
| Data Affected | |
| Containment Actions | |
| Root Cause | |
| Remediation Actions | |
| Notifications Made | MAS / PDPC / Investors / Law Enforcement |
| Lessons Learned | |
| Follow-up Actions | |
| Reviewed By | |
| Date Closed | |

### Annex C: Vendor Security Assessment Checklist

- [ ] SOC 2 Type II report or equivalent certification reviewed
- [ ] Data encryption at rest and in transit confirmed
- [ ] Access control and authentication mechanisms assessed
- [ ] Incident response and notification procedures documented
- [ ] Business continuity and disaster recovery capabilities assessed
- [ ] Data residency and cross-border transfer documented
- [ ] Subcontracting arrangements disclosed and assessed
- [ ] Contractual security and confidentiality obligations included
- [ ] Right to audit confirmed
- [ ] Data deletion/return upon termination confirmed
- [ ] Financial stability assessed
- [ ] Risk rating assigned: Critical / Important / Standard
- [ ] Assessment approved by: _______________
- [ ] Date: _______________

---

## APPROVAL AND REVIEW

| Version | Date | Approved By | Description |
|---------|------|-------------|-------------|
| 1.0 | [DATE] | Board of Directors | Initial adoption |

**Board Resolution:**

We, the Board of Directors of Pefko Capital Management Pte. Ltd., hereby approve this Technology and Cybersecurity Risk Management Framework and direct that it be implemented with immediate effect.

Signed:

_________________________
[NAME], Director

_________________________
[NAME], Director

Date: ___________________

---

*This Technology and Cybersecurity Risk Management Framework has been prepared in compliance with the MAS Technology Risk Management Guidelines. It is proportionate to the Company's size and operations as a VCFM. This Framework should be reviewed by a qualified cybersecurity professional or consultant and updated at least annually or when there are material changes to the Company's technology environment or the regulatory framework.*

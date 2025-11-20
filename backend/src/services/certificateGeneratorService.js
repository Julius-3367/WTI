const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Professional Certificate Generator Service
 * Generates beautifully formatted training certificates
 */

class CertificateGenerator {
    constructor() {
        // Define certificate dimensions (A4 landscape)
        this.width = 842; // A4 width in points (landscape)
        this.height = 595; // A4 height in points (landscape)
        this.margin = 50;
    }

    /**
     * Generate a professional certificate PDF
     * @param {Object} data - Certificate data
     * @param {string} data.certificateNumber - Certificate number
     * @param {string} data.candidateName - Full name of the candidate
     * @param {string} data.courseTitle - Course title
     * @param {Date} data.issueDate - Date of issue
     * @param {string} data.status - Certificate status
     * @returns {Promise<Buffer>} PDF buffer
     */
    async generateCertificate(data) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    layout: 'landscape',
                    margin: 0, // No auto-margins, we'll control everything
                    bufferPages: true, // Buffer pages to prevent auto-adding
                });

                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                this.drawCertificate(doc, data);
                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Draw the certificate design
     */
    drawCertificate(doc, data) {
        const centerX = this.width / 2;

        // Draw decorative border
        this.drawBorder(doc);

        // Add watermark/background text
        this.drawWatermark(doc);

        // Certificate header
        doc
            .fontSize(32)
            .font('Helvetica-Bold')
            .fillColor('#1e40af')
            .text('CERTIFICATE OF COMPLETION', this.margin, 80, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        // Decorative line under header
        doc
            .strokeColor('#78BE21')
            .lineWidth(3)
            .moveTo(centerX - 150, 130)
            .lineTo(centerX + 150, 130)
            .stroke();

        // Certificate number (top right)
        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#666666')
            .text(`Certificate No: ${data.certificateNumber}`, this.width - 200, 50, {
                align: 'right',
                width: 150,
            });

        // "This is to certify that"
        doc
            .fontSize(14)
            .font('Helvetica')
            .fillColor('#333333')
            .text('This is to certify that', this.margin, 160, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        // Candidate Name (large and prominent)
        doc
            .fontSize(36)
            .font('Helvetica-Bold')
            .fillColor('#1e40af')
            .text(data.candidateName, this.margin, 200, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        // "has successfully completed the training program"
        doc
            .fontSize(14)
            .font('Helvetica')
            .fillColor('#333333')
            .text('has successfully completed the training program', this.margin, 260, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        // Course Title (prominent)
        doc
            .fontSize(24)
            .font('Helvetica-Bold')
            .fillColor('#78BE21')
            .text(data.courseTitle, this.margin, 295, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        // Institution Name
        doc
            .fontSize(16)
            .font('Helvetica-Bold')
            .fillColor('#1e40af')
            .text('Waterfront Institute', this.margin, 350, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        // Issue Date and Status
        const issueDate = new Date(data.issueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        doc
            .fontSize(12)
            .font('Helvetica')
            .fillColor('#666666')
            .text(`Issue Date: ${issueDate}`, this.margin, 390, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        doc
            .fontSize(10)
            .fillColor('#10b981')
            .text(`Status: ${data.status}`, this.margin, 410, {
                align: 'center',
                width: this.width - 2 * this.margin,
            });

        // Achievement note
        if (data.achievementNote) {
            doc
                .fontSize(10)
                .font('Helvetica-Oblique')
                .fillColor('#666666')
                .text(data.achievementNote, this.margin + 100, 430, {
                    align: 'center',
                    width: this.width - 2 * this.margin - 200,
                });
        }

        // Signature section
        this.drawSignatureSection(doc, data);

        // Footer
        this.drawFooter(doc);
    }

    /**
     * Draw decorative border
     */
    drawBorder(doc) {
        // Outer border
        doc
            .strokeColor('#1e40af')
            .lineWidth(8)
            .rect(20, 20, this.width - 40, this.height - 40)
            .stroke();

        // Inner border
        doc
            .strokeColor('#78BE21')
            .lineWidth(2)
            .rect(30, 30, this.width - 60, this.height - 60)
            .stroke();

        // Corner decorations
        const cornerSize = 30;
        doc
            .strokeColor('#78BE21')
            .lineWidth(3);

        // Top left corner
        doc.moveTo(40, 40).lineTo(40 + cornerSize, 40).stroke();
        doc.moveTo(40, 40).lineTo(40, 40 + cornerSize).stroke();

        // Top right corner
        doc.moveTo(this.width - 40, 40).lineTo(this.width - 40 - cornerSize, 40).stroke();
        doc.moveTo(this.width - 40, 40).lineTo(this.width - 40, 40 + cornerSize).stroke();

        // Bottom left corner
        doc.moveTo(40, this.height - 40).lineTo(40 + cornerSize, this.height - 40).stroke();
        doc.moveTo(40, this.height - 40).lineTo(40, this.height - 40 - cornerSize).stroke();

        // Bottom right corner
        doc.moveTo(this.width - 40, this.height - 40).lineTo(this.width - 40 - cornerSize, this.height - 40).stroke();
        doc.moveTo(this.width - 40, this.height - 40).lineTo(this.width - 40, this.height - 40 - cornerSize).stroke();
    }

    /**
     * Draw watermark
     */
    drawWatermark(doc) {
        doc
            .fontSize(100)
            .font('Helvetica-Bold')
            .fillColor('#f0f0f0')
            .opacity(0.1)
            .text('WATERFRONT', this.margin, this.height / 2 - 50, {
                align: 'center',
                width: this.width - 2 * this.margin,
            })
            .opacity(1);
    }

    /**
     * Draw signature section
     */
    drawSignatureSection(doc, data) {
        const y = 470; // Moved up from 490
        const leftX = this.margin + 100;
        const rightX = this.width - this.margin - 250;

        // Signature lines
        doc.strokeColor('#cccccc').lineWidth(1);

        // Left signature line
        doc.moveTo(leftX, y).lineTo(leftX + 150, y).stroke();

        // Right signature line  
        doc.moveTo(rightX, y).lineTo(rightX + 150, y).stroke();

        // Signature labels
        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#666666')
            .text('Director', leftX, y + 5, {
                width: 150,
                align: 'center',
            });

        doc
            .fontSize(9)
            .fillColor('#999999')
            .text('Waterfront Institute', leftX, y + 20, {
                width: 150,
                align: 'center',
            });

        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#666666')
            .text('Authorized Signatory', rightX, y + 5, {
                width: 150,
                align: 'center',
            });

        doc
            .fontSize(9)
            .fillColor('#999999')
            .text('Training Department', rightX, y + 20, {
                width: 150,
                align: 'center',
            });
    }  /**
   * Draw footer
   */
    drawFooter(doc) {
        doc
            .fontSize(8)
            .font('Helvetica')
            .fillColor('#999999')
            .text(
                'This certificate is issued by Waterfront Institute and verifies successful completion of the training program.',
                this.margin,
                this.height - 40,
                {
                    align: 'center',
                    width: this.width - 2 * this.margin,
                }
            );
    }
}

module.exports = new CertificateGenerator();

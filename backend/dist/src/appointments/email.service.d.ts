export declare class EmailService {
    private resend;
    constructor();
    sendBookingNotifications(details: any): Promise<{
        success: boolean;
        id: string | undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        id?: undefined;
    }>;
    sendEmail(to: string, subject: string, html: string, text: string): Promise<void>;
}

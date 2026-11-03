"use client";

export default function Terms() {
    const sections = [
        {
            title: "1. Marketplace role",
            body: "StudioNest provides tools for independent hosts and creators to discover one another, document studio details, and manage reservation requests. Hosts remain responsible for the accuracy of their listings, the safety and legality of their spaces, and the services they agree to provide.",
        },
        {
            title: "2. Accounts and listing ownership",
            body: "You are responsible for activity performed through your account and for keeping your credentials private. Studio listings can only be edited or deleted by the signed-in account that owns them. Providing accurate host and contact information is required.",
        },
        {
            title: "3. Reservations and time collisions",
            body: "New reservation requests begin with Pending status. A request is not a confirmed hire until the host accepts it. The booking engine compares requested hours with Confirmed reservations for the same studio and date, and rejects overlapping time windows. Creators must provide accurate crew sizes and production notes.",
        },
        {
            title: "4. Rates, fees, and deposits",
            body: "Each booking summary separates the hourly studio hire, an 8% creator service fee, and the refundable security deposit. Deposit return is subject to the host agreement, including damage, missing equipment, overtime, or house-rule breaches. This portfolio preview does not process live payments.",
        },
        {
            title: "5. Cancellations and conduct",
            body: "Pending requests may be cancelled from My Bookings. Confirmed and completed reservations require direct resolution with the host. Creators must follow posted house rules, respect capacity limits, use equipment responsibly, and leave the space in the agreed condition.",
        },
        {
            title: "6. Privacy and local preview data",
            body: "This demonstration stores account, listing, wishlist, and booking data in your own browser storage so the complete workflow persists across reloads. Do not enter sensitive production information or reuse a password from another service. Clearing site data removes these local records.",
        },
        {
            title: "7. Content and images",
            body: "Hosts must only upload imagery they have permission to use and must represent the actual space fairly. Misleading, unlawful, discriminatory, or unsafe content is not permitted. Studio reviews should reflect genuine experiences and contain no private or harmful information.",
        },
    ];
    return (
        <div className="container-shell section-space">
            <div className="max-w-3xl">
                <p className="eyebrow">The clear agreement</p>
                <h1 className="page-title mt-4">Terms & privacy.</h1>
                <p className="mt-5 text-sm leading-7 text-muted">
                    Effective November 1, 2026. These preview terms explain how
                    StudioNest’s creator and host workflows are intended to
                    operate.
                </p>
            </div>
            <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr]">
                <aside className="h-fit rounded-[22px] bg-soft p-6 text-xs leading-6 text-muted lg:sticky lg:top-28">
                    <strong className="mb-2 block font-display text-base text-text">
                        The short version
                    </strong>
                    Be accurate. Respect the room. Review the total before
                    requesting. Only pending bookings can be cancelled directly.
                    Your preview data stays in this browser.
                </aside>
                <div className="space-y-9">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            className="border-b border-line pb-8"
                        >
                            <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                                {section.title}
                            </h2>
                            <p className="mt-4 text-sm leading-8 text-muted">
                                {section.body}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

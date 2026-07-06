import InviteAcceptClient from "./InviteAcceptClient";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    return <InviteAcceptClient token={token} />;
}

export type Message =
    | { action: 'open_gpm_for_domain'; domain: string }
    | { action: 'ping' };
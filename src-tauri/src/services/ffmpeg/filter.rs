pub fn build_afilter(fade_in: bool, fade_out: bool, duration: u64) -> String {
    const FADE_DURATION: u64 = 3;

    let mut filters = Vec::new();

    if fade_in {
        filters.push(format!("afade=in:d={}", FADE_DURATION));
    }

    if fade_out {
        let fade_start = duration.saturating_sub(FADE_DURATION);
        filters.push(format!("afade=out:st={}:d={}", fade_start, FADE_DURATION));
    }

    if filters.is_empty() {
        String::new()
    } else {
        format!("-af {}", filters.join(","))
    }
}

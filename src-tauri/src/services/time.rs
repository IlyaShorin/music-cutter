use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Timecode {
    pub hours: u64,
    pub minutes: u64,
    pub seconds: u64,
}

impl Timecode {
    pub fn parse(input: &str) -> Result<Self, String> {
        let parts: Vec<&str> = input.split(':').collect();

        match parts.len() {
            3 => {
                let hours = parts[0]
                    .parse::<u64>()
                    .map_err(|_| format!("Invalid hours: {}", parts[0]))?;
                let minutes = parts[1]
                    .parse::<u64>()
                    .map_err(|_| format!("Invalid minutes: {}", parts[1]))?;
                let seconds = parts[2]
                    .parse::<u64>()
                    .map_err(|_| format!("Invalid seconds: {}", parts[2]))?;

                if minutes >= 60 {
                    return Err("Minutes must be less than 60".to_string());
                }
                if seconds >= 60 {
                    return Err("Seconds must be less than 60".to_string());
                }

                Ok(Self {
                    hours,
                    minutes,
                    seconds,
                })
            }
            _ => Err("Timecode must be in HH:MM:SS format".to_string()),
        }
    }

    pub fn to_seconds(&self) -> u64 {
        self.hours * 3600 + self.minutes * 60 + self.seconds
    }

    #[allow(dead_code)]
    pub fn from_seconds(total: u64) -> Self {
        Self {
            hours: total / 3600,
            minutes: (total % 3600) / 60,
            seconds: total % 60,
        }
    }

    pub fn duration_to(&self, end: &Timecode) -> u64 {
        end.to_seconds().saturating_sub(self.to_seconds())
    }
}

impl fmt::Display for Timecode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:02}:{:02}:{:02}", self.hours, self.minutes, self.seconds)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_valid() {
        let tc = Timecode::parse("01:23:45").unwrap();
        assert_eq!(tc.hours, 1);
        assert_eq!(tc.minutes, 23);
        assert_eq!(tc.seconds, 45);
    }

    #[test]
    fn test_to_seconds() {
        let tc = Timecode::parse("01:02:03").unwrap();
        assert_eq!(tc.to_seconds(), 3723);
    }

    #[test]
    fn test_duration() {
        let start = Timecode::parse("00:01:00").unwrap();
        let end = Timecode::parse("00:02:30").unwrap();
        assert_eq!(start.duration_to(&end), 90);
    }
}

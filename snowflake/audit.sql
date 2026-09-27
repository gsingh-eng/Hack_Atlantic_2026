-- Veritas audit warehouse
-- Load snowflake/hearings.csv into VERITAS.PUBLIC.HEARINGS, then run these.

-- 1) Quotes the AI invented (checked but not on the record)
SELECT
  SUM(FACTS_CHECKED) AS quotes_checked,
  SUM(FACTS_ON_RECORD) AS quotes_on_record,
  SUM(FACTS_CHECKED - FACTS_ON_RECORD) AS quotes_invented,
  ROUND(100 * SUM(FACTS_CHECKED - FACTS_ON_RECORD) / NULLIF(SUM(FACTS_CHECKED), 0), 1) AS pct_invented
FROM VERITAS.PUBLIC.HEARINGS;

-- 2) How often the second look agreed
SELECT
  COUNT(*) AS hearings,
  SUM(IFF(APPEAL_AGREES = 'yes', 1, 0)) AS appeal_agreed,
  SUM(IFF(APPEAL_AGREES IS NULL OR APPEAL_AGREES = '', 1, 0)) AS appeal_missing
FROM VERITAS.PUBLIC.HEARINGS;

-- 3) Outcomes by category
SELECT CATEGORY, OUTCOME, COUNT(*) AS cases
FROM VERITAS.PUBLIC.HEARINGS
GROUP BY CATEGORY, OUTCOME
ORDER BY cases DESC;

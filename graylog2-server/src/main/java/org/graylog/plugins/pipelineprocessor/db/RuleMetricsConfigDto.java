/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog.plugins.pipelineprocessor.db;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.google.auto.value.AutoValue;

@AutoValue
@JsonDeserialize(builder = RuleMetricsConfigDto.Builder.class)
public abstract class RuleMetricsConfigDto {
    private static final String FIELD_METRICS_ENABLED = "metrics_enabled";

    @JsonProperty(FIELD_METRICS_ENABLED)
    public abstract boolean metricsEnabled();

    public static Builder builder() {
        return Builder.create();
    }

    public static RuleMetricsConfigDto createDefault() {
        return builder().build();
    }

    @AutoValue.Builder
    public abstract static class Builder {
        @JsonCreator
        public static Builder create() {
            return new AutoValue_RuleMetricsConfigDto.Builder().metricsEnabled(false);
        }

        @JsonProperty(FIELD_METRICS_ENABLED)
        public abstract Builder metricsEnabled(boolean metricsEnabled);

        public abstract RuleMetricsConfigDto build();
    }
}

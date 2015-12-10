<?xml version="1.0"?>

<xsl:transform version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="@code">
     <xsl:attribute name="csd-code">
        <xsl:value-of select="."/>
     </xsl:attribute>
  </xsl:template>

  <xsl:template match="@displayName">
     <xsl:attribute name="originalText">
        <xsl:value-of select="."/>
     </xsl:attribute>
  </xsl:template>

  <xsl:template match="AuditSourceIdentification">
    <xsl:copy>
      <xsl:attribute name="code">
        <xsl:value-of select="AuditSourceTypeCode/@code"/>
      </xsl:attribute>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="AuditSourceTypeCode">
  </xsl:template>

  <xsl:template match="ActiveParticipant">
    <xsl:copy>
      <xsl:attribute name="UserIsRequestor">false</xsl:attribute>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

</xsl:transform>

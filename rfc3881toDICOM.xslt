<?xml version="1.0"?>

<xsl:transform version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <!-- Convert RFC 3881 to DICOM -->
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
  <!-- END Convert RFC 3881 to DICOM -->

  <!-- Fix OpenXDS audits -->
  <xsl:template match="ActiveParticipant">
    <xsl:copy>
      <xsl:attribute name="UserIsRequestor">false</xsl:attribute>
      <xsl:attribute name="AlternativeUserID">unknown</xsl:attribute>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="ParticipantObjectIDTypeCode">
    <xsl:copy>
      <xsl:attribute name="originalText">unknown</xsl:attribute>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <xsl:template xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" match="@xsi:type">
  </xsl:template>

  <xsl:template match="ParticipantObjectIDTypeCode/@codeSystem">
    <xsl:attribute name="codeSystemName">
      <xsl:value-of select="."/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="ParticipantObjectIDTypeCode[@code='urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd']">
    <xsl:copy>
      <xsl:attribute name="originalText">submission set classificationNode</xsl:attribute>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="RoleIDCode[@displayName='Source']/@displayName">
    <xsl:attribute name="originalText">Source Role ID</xsl:attribute>
  </xsl:template>

  <xsl:template match="RoleIDCode[@displayName='Destination']/@displayName">
    <xsl:attribute name="originalText">Destination Role ID</xsl:attribute>
  </xsl:template>
  <!-- END Fix OpenXDS audits -->

</xsl:transform>

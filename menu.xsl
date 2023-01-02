<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
	<xsl:template match="/">
		<table id="menuTable" border="1" class="indent">
			<thead>
				<tr>
					<th>Select</th>
					<th>Item</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>
				<xsl:for-each select="//category">
					<tr>
						<td colspan="3">
							<xsl:value-of select="@name" />
						</td>
					</tr>
					<xsl:for-each select="item">
						<tr id="{position()}">
							<xsl:attribute name="decaf">
								<xsl:value-of select="boolean(@decaf)" />
							</xsl:attribute>
							<td align="center">
								<input name="item0" type="checkbox" />
							</td>
							<td>
								<xsl:value-of select="listing" />
							</td>
							<td align="right">
								<xsl:value-of select="price" />
							</td>
						</tr>
					</xsl:for-each>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:transform>
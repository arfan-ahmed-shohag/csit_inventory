import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ImageRun, TableOfContents, TabStopType, TabStopPosition, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';

export interface SubTopic {
  title: string;
  content: string;
}

export interface Chapter {
  title: string;
  content?: string;
  imageBuffer?: ArrayBuffer;
  subTopics?: SubTopic[];
}

export interface BoardMember {
  roleLabel: string;
  name: string;
  department?: string;
  faculty?: string;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  studentName: string;
  studentId: string;
  studentRegNo: string;
  session: string;
  submissionDate: string;
  supervisorName: string;
  supervisorDesignation: string;
  supervisorDept: string;
  supervisorFaculty: string;
  abstract: string;
  acknowledgments: string;
  boardMembers: BoardMember[];
  chapters: Chapter[];
  logoBuffer?: ArrayBuffer;
}

export const parseHtmlToDocx = (htmlStr: string): Paragraph[] => {
  if (!htmlStr) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, "text/html");
  const paragraphs: Paragraph[] = [];

  const parseNode = (node: ChildNode, currentFormat: any = {}): TextRun[] => {
    let runs: TextRun[] = [];
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent) {
          const text = child.textContent.replace(/\u00A0/g, ' ');
          runs.push(new TextRun({ text: text, size: 24, ...currentFormat }));
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const format = { ...currentFormat };
        if (el.tagName === 'STRONG' || el.tagName === 'B') format.bold = true;
        if (el.tagName === 'EM' || el.tagName === 'I') format.italics = true;
        if (el.tagName === 'U') format.underline = { type: 'single' };

        runs = runs.concat(parseNode(child, format));
      }
    });
    return runs;
  };

  const pSpacing = { line: 360, after: 200 };

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const textContent = el.textContent || "";
      if (el.tagName === 'P') {
        const runs = parseNode(el);
        if (runs.length > 0 && textContent.trim() !== '') {
          paragraphs.push(new Paragraph({ children: runs, spacing: pSpacing, alignment: AlignmentType.JUSTIFIED }));
        }
      } else if (el.tagName === 'UL') {
        el.childNodes.forEach((li) => {
          if (li.nodeName === 'LI' && li.textContent?.trim() !== '') {
            paragraphs.push(new Paragraph({ children: parseNode(li), bullet: { level: 0 }, spacing: pSpacing, alignment: AlignmentType.JUSTIFIED }));
          }
        });
      } else if (el.tagName === 'OL') {
        el.childNodes.forEach((li) => {
          if (li.nodeName === 'LI' && li.textContent?.trim() !== '') {
            paragraphs.push(new Paragraph({ children: parseNode(li), bullet: { level: 0 }, spacing: pSpacing, alignment: AlignmentType.JUSTIFIED }));
          }
        });
      } else {
        const runs = parseNode(el);
        if (runs.length > 0 && textContent.trim() !== '') {
          paragraphs.push(new Paragraph({ children: runs, spacing: pSpacing, alignment: AlignmentType.JUSTIFIED }));
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: node.textContent, size: 24 })], spacing: pSpacing, alignment: AlignmentType.JUSTIFIED }));
    }
  });

  return paragraphs;
};

export const generateDocx = async (data: ReportData): Promise<Blob> => {
  const sections = [];

  const titlePageChildren: any[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1000, after: 200 },
      children: [
        new TextRun({
          text: data.title,
          bold: true,
          size: 32,
        }),
      ],
    }),
  ];

  if (data.subtitle) {
    titlePageChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: data.subtitle,
            bold: true,
            size: 28,
          }),
        ],
      })
    );
  }

  titlePageChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200, after: 200 },
      children: [
        new TextRun({
          text: "by",
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: data.studentName,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 },
      children: [
        new TextRun({
          text: "PROJECT SUBMITTED IN PARTIAL FULLFILLMENT OF THE DEGREE OF",
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [
        new TextRun({
          text: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE & ENGINEERING",
          size: 24,
        }),
      ],
    })
  );

  if (data.logoBuffer) {
    titlePageChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        children: [
          new ImageRun({
            type: "png",
            data: data.logoBuffer,
            transformation: {
              width: 120,
              height: 120,
            },
          }),
        ],
      })
    );
  } else {
    titlePageChildren.push(new Paragraph({ spacing: { after: 800 } }));
  }

  titlePageChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "FACULTY OF COMPUTER SCIENCE & ENGINEERING",
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [
        new TextRun({
          text: "PATUAKHALI SCIENCE & TECHNOLOGY UNIVERSITY",
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1500 },
      children: [
        new TextRun({
          text: data.submissionDate,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  sections.push({
    properties: {},
    children: titlePageChildren,
  });

  sections.push({
    properties: {},
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        children: [new TextRun({ text: "DECLARATION OF ORIGINAL WORK", bold: true, size: 28 })],
      }),
      new Paragraph({
        spacing: { line: 360 },
        children: [
          new TextRun({
            text: `The project titled “${data.title}”, submitted by ${data.studentName}, Roll No. ${data.studentId}, Session: ${data.session} to the Faculty of Computer Science and Engineering, Patuakhali Science & Technology University, has been accepted as satisfactory for the fulfilment of the requirements for the degree of Bachelor of Science in Computer Science & Engineering and approved as to its style and contents.`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  });

  const examineeChildren: any[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "Board of Examinee", bold: true, size: 28 })],
    }),
  ];

  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: "auto" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
    left: { style: BorderStyle.NONE, size: 0, color: "auto" },
    right: { style: BorderStyle.NONE, size: 0, color: "auto" },
  };

  data.boardMembers.forEach((member) => {
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ borders: noBorder, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Signature", size: 24 })] })] }),
          new TableCell({ borders: noBorder, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: ":", size: 24 })] })] }),
          new TableCell({ borders: noBorder, width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "______________________________", size: 24 })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ borders: noBorder, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: member.roleLabel, size: 24 })] })] }),
          new TableCell({ borders: noBorder, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: ":", size: 24 })] })] }),
          new TableCell({ borders: noBorder, width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: member.name, size: 24 })] })] }),
        ],
      }),
    ];

    if (member.department) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ borders: noBorder, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Dept. Name", size: 24 })] })] }),
            new TableCell({ borders: noBorder, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: ":", size: 24 })] })] }),
            new TableCell({ borders: noBorder, width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: member.department, size: 24 })] })] }),
          ],
        })
      );
    }
    if (member.faculty) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ borders: noBorder, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Faculty Name", size: 24 })] })] }),
            new TableCell({ borders: noBorder, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: ":", size: 24 })] })] }),
            new TableCell({ borders: noBorder, width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: member.faculty, size: 24 })] })] }),
          ],
        })
      );
    }

    examineeChildren.push(
      new Table({
        rows: tableRows,
        columnWidths: [4000, 500, 5500],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }),
      new Paragraph({ spacing: { after: 400 } })
    );
  });

  examineeChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1000 },
      children: [new TextRun({ text: "Patuakhali Science and Technology University, Bangladesh", size: 24 })],
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  sections.push({
    properties: {},
    children: examineeChildren,
  });

  sections.push({
    properties: {},
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Certificate", bold: true, size: 28 })],
      }),
      new Paragraph({
        spacing: { line: 360 },
        children: [
          new TextRun({
            text: "This is to certify that this is a record of the project presented by the student whose name are given below in fulfillment of the requirements of the degree of Bachelor of Science in Computer Science and Engineering.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 1000, after: 200 },
        children: [new TextRun({ text: data.studentName, bold: true, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: `ID: ${data.studentId}`, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: `Reg. No: ${data.studentRegNo}`, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 4000 },
        children: [new TextRun({ text: `Session: ${data.session}`, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun({ text: "Supervised By", bold: true, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorName, bold: true, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorDesignation, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorDept, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorFaculty, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Patuakhali Science & Technology University", size: 24 })],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  });

  sections.push({
    properties: {},
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        children: [new TextRun({ text: "DEDICATION", bold: true, size: 28 })],
      }),
      new Paragraph({
        spacing: { line: 360 },
        children: [
          new TextRun({
            text: "We dedicate this project to Allah Almighty, our Creator, our strong pillar, and our source of inspiration, wisdom, knowledge, and understanding. We also dedicate this work to our family and friends, whose support and encouragement have been invaluable throughout this journey.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  });

  sections.push({
    properties: {},
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Letter of Approval", bold: true, size: 28 })],
      }),
      new Paragraph({
        spacing: { line: 360 },
        children: [
          new TextRun({
            text: `This Project Submitted by ${data.studentName} bearing ID No. ${data.studentId} in partial fulfillment of Final Project Submission for B.Sc. in CSE degree has been examined and accepted for further process.`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 6000, after: 400 },
        children: [new TextRun({ text: "Approved", bold: true, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: ".....................................................", bold: true, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorName, bold: true, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorDesignation, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorDept, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: data.supervisorFaculty, size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 1500 },
        children: [new TextRun({ text: "Patuakhali Science & Technology University", size: 24 })],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  });

  sections.push({
    properties: {},
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        children: [new TextRun({ text: "ABSTRACT", bold: true, size: 28 })],
      }),
      ...parseHtmlToDocx(data.abstract),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  });

  sections.push({
    properties: {},
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        children: [new TextRun({ text: "ACKNOWLEDGMENTS", bold: true, size: 28 })],
      }),
      ...parseHtmlToDocx(data.acknowledgments),
      new Paragraph({
        spacing: { before: 4000, after: 100 },
        children: [new TextRun({ text: "With Best Regards,", size: 24 })],
      }),
      new Paragraph({
        spacing: { after: 0 },
        children: [new TextRun({ text: data.studentName, size: 24 })],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  });

  sections.push({
    properties: {},
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Contents", bold: true, size: 28, color: "0070C0" })],
      }),
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-3",
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  });

  data.chapters.forEach((chapter, index) => {
    const chapterNumber = index + 1;
    const chapterChildren: any[] = [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 300 },
        children: [
          new TextRun({ text: `CHAPTER ${chapterNumber}`, bold: true, size: 32 }),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: chapter.title.toUpperCase(), bold: true, size: 28 }),
        ],
      }),
    ];

    // Use HTML parser for chapter content
    const chapterParagraphs = parseHtmlToDocx(chapter.content || "");
    chapterParagraphs.forEach(p => chapterChildren.push(p));

    // Render sub-topics
    if (chapter.subTopics && chapter.subTopics.length > 0) {
      chapter.subTopics.forEach((subTopic, subIndex) => {
        chapterChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({ text: `${chapterNumber}.${subIndex + 1} ${subTopic.title}`, bold: true, size: 26 }),
            ],
          })
        );

        const subTopicParagraphs = parseHtmlToDocx(subTopic.content);
        subTopicParagraphs.forEach(p => chapterChildren.push(p));
      });
    }

    if (chapter.imageBuffer) {
      chapterChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1000, after: 1000 },
          children: [
            new ImageRun({
              type: "png",
              data: chapter.imageBuffer,
              transformation: {
                width: 500,
                height: 300,
              },
            }),
          ],
        })
      );
    }

    chapterChildren.push(new Paragraph({ children: [new PageBreak()] }));

    sections.push({
      properties: {},
      children: chapterChildren,
    });
  });

  const doc = new Document({
    features: {
      updateFields: true,
    },
    sections: sections,
  });

  return await Packer.toBlob(doc);
};
